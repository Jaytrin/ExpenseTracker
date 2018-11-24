const express = require('express');
const server = express();
const mysql = require('mysql');
const credentials = require('./mysql_connect.js');
const db = mysql.createConnection(credentials);
const bodyParser = require('body-parser');

server.use(express.static(__dirname + '/html'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

db.connect((err) => {
    if(err){
        console.log('connection to database failed');
    } else {console.log('connected to database')
}});

server.get('/test', function(request, response){
    console.log('request body: ', request.body);
});

server.post('/login', (request, response)=>{
    // console.log('request item:', request.body.item);
    console.log('request vendor:=====================', request.body.vendor);
    const output = {
        success: false,
        loggedin: false
    }

    db.connect(function(){
        const query = `SELECT * from user`;
        db.query(query, (error, data, fields)=>{
            output.success = true;
            console.log(data[0]);
            if(!error){
                if(data.length > 0){
                    output.loggedin = true;
                    output.userData = data[0];
                    output.message = '';
                } else{
                    output.message = 'invalid username or password';
            }}
            console.log('Fields:', fields);
            response.send(JSON.stringify(output));
        })
    });
});

console.log('server running');

server.listen(3050, ()=>{
	console.log('server listening on 3050');
})