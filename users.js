const mysql = require('mysql');

module.exports = (app, database) => {

    console.log('connected to users');

    app.post('/signUp', (request, response)=>{
        response.send('Sign Up Attempted');

        const username = request.body.username;
        const email = request.body.email;
        const fname = request.body.fname;
        const lname = request.body.lname;
        const password = request.body.password;
        
    //User Creation
        //Build query for item
        const userSubmitQuery = "INSERT INTO user SET ID = null, username = ?, email = ?, fname = ?, lname = ?";
        const userSubmitInserts = [username, email, fname, lname];
        const userSubmitSql = mysql.format(userSubmitQuery, userSubmitInserts);

        //Query to check if username exists
        const userCheckQuery = "SELECT ID FROM user WHERE username = ?";
        const userCheckSql = mysql.format(userCheckQuery, username);

        //Query to check if email exists
        const emailCheckQuery = "SELECT ID FROM user WHERE email = ?";
        const emailCheckSql = mysql.format(emailCheckQuery, email);

    //Sign Up checks
        //Check if username already exists
        database.query(userCheckSql, (error, data, fields) => {
            console.log('Checking username...');
            if(!data.length){
        //Check if email already exists
                database.query(emailCheckSql, (error, data, fields)=>{
                    console.log('Checking email...');
                    if(!data.length){
        //Creates user
                        database.query(userSubmitSql, (error, data, fields)=>{
                            if(!error){
                                console.log('User successfully created.')
                     }})} else {console.log('Email has already been used.');
        }});} else {console.log('Username already exists');
        }})

    });



};
