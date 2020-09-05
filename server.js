const app = require('./app')
const https = require('https')

https.createServer(app).listen(process.env.PORT)