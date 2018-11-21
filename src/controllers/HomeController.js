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
            connection.query('select id from menu order by id desc',(err,result)=>{
            var data = [
                [result[0].id*1+1,req.body.name,req.body.type,req.body.time,req.body.desc,req.file.filename,req.file.filename,idChef]
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
    connection.query('select * from menu where id = ?',[req.params.id],(err,result)=>{
        if(err){console.log(err)}
        else{
                list = result[0]
        }
        res.render('edit',{list:list})
    })
}

var update = (req,res) => {
    var uploadsEdit = multer({
        storage:storage,
        fileFilter:(req,file,cb)=>{
            checkFileType(file,cb)
        }
    }).single('pictureEdit');
    uploadsEdit(req,res,(err)=>{
        if(err){console.log(err)}
        else{
            let picture = ''
            if(req.file!=undefined){
                picture=req.file.filename
            }
            let data = [req.body.name,req.body.types,req.body.time,req.body.desc,picture,undefined,req.params.id]
            connection.query('update menu set name = ?,types = ?,time = ?,descrip = ?,image = ?,video = ? where id = ?',data,(err,result)=>{
                if(err){console.log(err)}
                else{
                    res.redirect('/adminMenu')
                }
            })
        }
    })
}

var remove = (req,res) => {
    connection.query('delete from menu where id = ?',[req.params.id],(err,result)=>{
        if(err){console.log(err)}
        else{}
        res.redirect('/adminMenu')
    })
}

var showMenuAdmin = (req,res) => {
    var list = []
    connection.query('select id,name,types from menu where idchef = ?',[idChef],(err,result)=>{
        if(err){console.log(err)}
        else{
            for(let i=0;i<result.length;i++){
                list.push({name:result[i].name,types:result[i].types,id:result[i].id})
            }
        }
        res.render('showMenuAdmin',{list:list})
    })
}

var showCos = (req,res) => {
    let list = []
    let word = req.query.word || ''
    let sql = "select * from menu where name like '%"+word+"%' or types = '"+word+"'"
    connection.query(sql,(err,result)=>{
        if(err){console.log(err)}
        else{
            for(let i=0;i<result.length;i++){
                list.push(result[i])
            }
        }
        res.render('showCos',{list:list})
    })
}

var detail = (req,res) => {
    let list = {}
    connection.query('select * from menu where id = ?',[req.params.id],(err,result)=>{
        let k = ''
        if(err){console.log(err)}
        else{
            list = result[0]

            let desc = list.descrip+''
            for(let i=0;i<desc.length;i+=51){
                k+='\n'+desc.slice(i,51+i)
            }
        }
        res.render('detail',{list:list,desc:k})
    })
}

var search = (req,res) => {
    res.redirect('/showCos?word='+req.body.search)
}

module.exports = {index,present,create,edit,showMenuAdmin,showCos,detail,insert,login,update,remove,search}     