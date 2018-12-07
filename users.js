const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
        database.query(userCheckSql, (error, data) => {
            console.log('Checking username...');
            if(!data.length){
        //Check if email already exists
                database.query(emailCheckSql, (error, data)=>{
                    console.log('Checking email...');
                    if(!data.length){
        //Creates user
                        database.query(userSubmitSql, (error, data)=>{
                            if(!error){
                                console.log('User successfully created.')

                                //Hash and insert password
                                bcrypt.hash(password, saltRounds, (error, hash) => {

                                    const userIDQuery = "SELECT ID FROM user WHERE username = ? AND email = ?";
                                    const userIDInserts = [username, email];
                                    const userIDSQL = mysql.format(userIDQuery,userIDInserts);

                                    database.query(userIDSQL, (error, data, fields)=> {
                                        if(!error){
                                            const userID = data[0]['ID'];
                                            const passwordSubmitQuery = "INSERT INTO password SET ID = null, hash = ?, user_id = ?";
                                            const passwordSubmitInserts = [hash, userID];
                                            const passwordSubmitSQL = mysql.format(passwordSubmitQuery, passwordSubmitInserts);

                                            database.query(passwordSubmitSQL, (error,data) => {
                                                if(!error){
                                                    console.log('Password successfully submitted');
                                                } else {console.log('Error creating password')
                                                console.log('password: ', password);
                                                console.log('user_id: ',userID);
                                            }
                                            });
                                        } else {console.log('Cannot find userID')}
                                    });});
}})} else {console.log('Email has already been used.');
        }});} else {console.log('Username already exists');
        }})

    });

    app.post('/login', (request, response)=>{
        response.send('Login Attempted');
        const output={
            success: false,
            loggedin: false
        }
        db.connect(()=>{
            const loginQuery = `SELECT ID, username, email, fname, lname, status 
                           FROM users AS u
                           JOIN password AS p
                           ON u.ID = p.user_id 
                           WHERE u.username = ? AND p.hash = ? AND status = ?`;
            const loginInserts = [username, password, 'active'];
            const loginSQL = mysql.format(loginQuery, loginInserts);
            console.log(query);
        })
});
