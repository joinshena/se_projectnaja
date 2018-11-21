var express = require('express')
var path = require('path')

var router = require('./routes/routes')

port = 9999

var app = express()

app.set('views',path.join(__dirname,'src/views'))
app.set('view engine','ejs')
app.engine('html',require('ejs').renderFile)

app.use(express.static(__dirname + '/publics'))
app.use('/',router)
app.use(express.static(__dirname + '/publics/images/'))
app.use(express.static(__dirname + '/uploads/'))

app.listen(port,()=>{
    console.log('เข้า '+port)
})

module.exports = app