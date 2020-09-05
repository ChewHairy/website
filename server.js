const app = require('./app')
const http = require('http')

console.log(process.env.PORT)

http.createServer(app).listen(process.env.PORT)