var express = require('express')
var bodyParser = require('body-parser')

var router = express.Router()

var controllers = require('../src/controllers/HomeController')

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/',controllers.index)

router.get('/present',controllers.present)

router.get('/create',controllers.create)

router.post('/insert',controllers.insert)

router.get('/edit/:id',controllers.edit)

router.post('/update/:id',controllers.update)

router.get('/delete/:id',controllers.remove)

router.get('/adminMenu',controllers.showMenuAdmin)

router.get('/showCos',controllers.showCos)

router.get('/detail/:id',controllers.detail)

router.post('/login',controllers.login)

router.post('/search',controllers.search)

module.exports = router