const mysql = require('mysql');

module.exports = (app, database) => {
    console.log('connected to trackexpense');

    //Endpoint to submit a budget
    app.post('/submitBudget', (request, response)=>{
        response.send('Thank you for submitting a budget');
        
        const budget = request.body.budget;
        const budget = request.body.amount;
    //Adjust amount remaining

    //Budget Section
        //Buil query for budget
        const budgetQuery = "INSERT INTO budget SET ID = null, name = ?, amount = ?";
        const budgetInserts = [budget, amount];
        const budgetSql = mysql.format(budgetQuery,budgetInserts);

        database.query(budgetSql, (error, data, field) => {
            if(!error){
                console.log('Budget successfully submitted.');
            } else {
                console.log('Budget failed to submit');
            }
        })
    }

    //Endpoint to get data for budget and expenses for a specific user
    app.post('/getData', (request, response)=>{
        response.send('Budget being fetched.');
        
        const username = request.body.username;

    //Get budget Section
        const getBudgetQuery = "SELECT b.name, b.amount, b.remaining
                             FROM budget AS b 
                             JOIN budget_expense AS be 
                             ON b.ID = be.budget_id
                             JOIN user AS u 
                             ON u.ID = be.user_id 
                             WHERE user.username = ?";
                             
        const getBudgetInserts = [username];
        const getBudgetSql = mysql.format(getBudgetQuery,getBudgetInserts);

        database.query(budgetSql, (error, data, field) => {
            if(!error){
                console.log('Budget successfully submitted.');
            } else {
                console.log('Budget failed to submit');
            }
        })
    }

    app.post('/submitExpense', (request, response)=>{
        response.send('Thank you for submitting an expense');
        
        const date = request.body.date;
        const item = request.body.item;
        const price = request.body.price;
        const vendor = request.body.vendor;
        const username = request.body.username;
        const budget = request.body.budget;

    //Insert Expense
        //Build query for item
        const expenseQuery = "INSERT INTO expense SET ID = null, date = ?, vendor = ?, name = ?, price = ?";
        const expenseInserts = [date, vendor, item, price];
        const expenseSql = mysql.format(expenseQuery, expenseInserts);

        //Build query to check if item already within database
        const expenseCheckQuery = "SELECT ID FROM item WHERE date = ? AND name = ? AND price = ?";
        const expenseInserts = [date, name, price]
        const expenseCheckSql = mysql.format(expenseCheckQuery, expenseInserts);

        //Run query to check for item and insert if not in database
        database.query(expenseCheckSql, (error, data, fields) => {
            if(!data.length){
                database.query(expenseSql, (error, data, fields)=>{
                    if(!error){
                        console.log('Expense successfully inputted.');
                     } else {console.log('Expense failed to be inputted.');
        }});}})
    }




};
