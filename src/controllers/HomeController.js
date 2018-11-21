var connection = require('../../config/connectMysql')
var path = require('path')
var multer = require('multer')

var idChef = ''

//multer
var storage = multer.diskStorage({
    destination:'./uploads/',
    filename:(req,file,cb)=>{
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
var uploads = multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb)
    }
}).single('picture');

function checkFileType(file,cb){
    const filetypts = /jpeg|jpg|png|gif/;

    const extname = filetypts.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypts.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: Images Only!');
    }
}

var login = (req,res) => {
    connection.query('select id,username,password from chef',(err,result) => {
        if(err){console.log(err)}
        else{
            let uname = req.body.uname
            let psw = req.body.psw
            for(let i=0;i<result.length;i++){
                if(result[i].username==uname && result[i].password==psw){
                    idChef = result[i].id
                    res.redirect('/adminMenu')
                    return
                }
            }
        }
        res.redirect('/')
    })
}

var index = (req,res) => {
    res.render('index')
}

var present = (req,res) => {
    res.render('present')
}

var create = (req,res) => {
    res.render('create')
}

var insert = (req,res) => {
    uploads(req,res,(err)=>{
        if(err){console.log(err)}
        else{
            connection.query('select count(*) as couter from menu',(err,result)=>{
            var data = [
                [result[0].couter+1,req.body.name,req.body.type,req.body.time,req.body.desc,req.file.filename,req.file.filename,idChef]
            ]

            connection.query('insert into menu values ?',[data],(err,result)=>{
                if(err){console.log(err)}
                else{}
            })
            })
        }
        res.redirect('/adminMenu')
    })
}

var edit = (req,res) => {
    let list = {}
    connection.query('select * from menu where idchef = ?',[idChef],(err,result)=>{
        if(err){console.log(err)}
        else{
            for(let i=0;i<result.length;i++){
                if(i==req.params.id){
                    list = result[i]
                }
            }
        }
        res.render('edit',{list:list})
    })
}

var update = (req,res) => {
    res.redirect('/adminMenu')
}

var showMenuAdmin = (req,res) => {
    var list = []
    connection.query('select name,types from menu where idchef = ?',[idChef],(err,result)=>{
        if(err){console.log(err)}
        else{
            for(let i=0;i<result.length;i++){
                list.push({name:result[i].name,types:result[i].types})
            }
        }
        res.render('showMenuAdmin',{list:list})
    })
}

var showCos = (req,res) => {
    res.render('showCos')
}

var detail = (req,res) => {
    res.render('detail')
}

module.exports = {index,present,create,edit,showMenuAdmin,showCos,detail,insert,login,update}     