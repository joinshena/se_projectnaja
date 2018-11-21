const mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'cookingdb'
});
connection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else 
        console.log('DB connection failed \n Error : '+JSON.stringify(err,undefined,2));
});
module.exports = connection;
