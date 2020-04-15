var mysql = require('mysql')
var conn = mysql.createConnection({
    user:"root",
    password:"",
    host:"localhost",
    database:"test"
})
conn.connect((err)=>{
    if(err){
        console.log("Error")
    }
    else{
        console.log("connect")
    }
})

//run command nodemon filename.js