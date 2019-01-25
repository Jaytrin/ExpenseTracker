const express = require('express');
const server = express();
const mysql = require('mysql');
const credentials = require('./mysql_connect.js');
const database = mysql.createConnection(credentials);
const bodyParser = require('body-parser');

server.use(express.static(__dirname + '/html'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


server.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // next();
  });


database.connect((err) => {
    if(err){
        console.log('connection to database failed');
    } else {console.log('connected to database')
}});

// trackExpense.submitExpense;

// server.post('/login', (request, response)=>{

//     const output = {
//         success: false,
//         loggedin: false
//     }

//     database.connect(function(){
//         const query = `SELECT * from user`;
//         database.query(query, (error, data, fields)=>{
//             output.success = true;
//             console.log(data[0]);
//             if(!error){
//                 if(data.length > 0){
//                     output.loggedin = true;
//                     output.userData = data[0];
//                     output.message = '';
//                 } else{
//                     output.message = 'invalid username or password';
//             }}
//             console.log('Fields:', fields);
//             response.send(JSON.stringify(output));
//         })
//     });
// });

require('./trackexpense')(server,database);
require('./users')(server,database);

console.log('server running');

server.listen(3050, ()=>{
	console.log('server listening on 3050');
})
