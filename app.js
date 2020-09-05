const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const yup = require('yup')
const monk = require('monk')
const { nanoid } = require('nanoid')

const schema = yup.object().shape({
    alias: yup.string().trim().matches(/[\w\-]/),
    url: yup.string().trim().url().required()
})

//const db = monk(process.env.MONGO_URI)
const db = monk("mongodb+srv://hairy:1337@hairy.gvxpi.mongodb.net/Hairy?retryWrites=true&w=majority")
const urls = db.get('urls')
urls.createIndex({ alias: 1 }, { unique: true })

const app = express()

app.use(helmet())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json());

app.use(express.static('./public'))

app.get('/:id', async (req, res, next) => {
    const { id: alias } = req.params
    try {
        const url = await urls.findOne({ alias })
        if (url) {
            res.redirect(url.url)
        } else {
            res.redirect(`/?error=${alias} not found`)
        }
    } catch (error) {
        res.redirect(`/?error=Link not found`)
    }
})

app.post('/', async (req, res, next) => {
    let { alias, url } = req.body
    try {
        await schema.validate({
            alias,
            url
        })
        if (!alias) {
            alias = nanoid(5)
        } 
        alias = alias.toLowerCase()
        const newUrl = {
            url,
            alias
        }
        const created = await urls.insert(newUrl)
        res.json(created)
    } catch (error) {
        if (error.message.startsWith('E11000')) {
            error.message = 'Alias in use. 🍔'
        }
        next(error)
    }
})

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status)
    } else {
        res.status(500)
    }
    res.json({
        message: error.message
    })
})

app.listen(process.env.PORT || 1337, () => {
    console.log('listening, lol.')
})