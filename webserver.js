const express = require('express');
const server = express();
const mysql = require('mysql');
const credentials = require('./mysql_connect.js');
const db = mysql.createConnection(credentials);

server.use(express.static(__dirname + '/html'));



server.get('/test', function(request, response){
    db.connect(function(){
        db.query('SELECT * FROM ')
    })
    console.log('request received');
    response.send('test working');
})


console.log('server running');

server.listen(3050, ()=>{
	console.log('server listening on 3050');
})