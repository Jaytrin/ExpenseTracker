const mysql = require('mysql');

module.exports = (app, database) => {
    console.log('connected to trackexpense');

    //Endpoint to submit a budget
    app.post('/submitBudget', (request, response)=>{
        response.send('Thank you for submitting a budget');
        
        const budget = request.body.budget;
        const amount = request.body.amount;
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
    });

    //Endpoint to get data for budget and expenses for a specific user
    app.post('/getData', (request, response)=>{
        response.send('Budget being fetched.');
        
        const username = request.body.username;

    //Get budget Section
        const getBudgetQuery = `SELECT b.name AS budget, b.amount, b.remaining, e.date, e.vendor, e.item, e.price
                             FROM budget AS b 
                             JOIN budget_expense AS be 
                             ON b.ID = be.budget_id
                             JOIN expense AS e
                             ON e.ID = be.expense_id
                             JOIN user AS u 
                             ON u.ID = be.user_id 
                             WHERE u.username = ?`;
                             
        const getBudgetInserts = [username];
        const getBudgetSql = mysql.format(getBudgetQuery,getBudgetInserts);

        database.query(getBudgetSql, (error, data, field) => {
            if(!error){
                const displayData = [];
                for(let i = 0; i < data.length; i++){
                    const rowData = {};
                    displayData['budget'] = data[i]['budget'];
                    displayData['amount'] = date[i]['amount'];
                    displayData['remaining'] = date[i]['remaining'];
                    displayData['date'] = date[i]['date'];
                    displayData['vendor'] = date[i]['vendor'];
                    displayData['item'] = date[i]['item'];
                    displayData['price'] = date[i]['price'];
                    displayData.push(rowData);
                }
                console.log('Budget successfully submitted.');
                console.log(displayData);
                return displayData;
            } else {
                console.log('Budget failed to submit');
            }
        })
    })

    app.post('/submitExpense', (request, response)=>{
        response.send('Thank you for submitting an expense');

        const date = String(request.body.date);
        console.log('date: ', date);
        const item = request.body.item;
        const price = request.body.price;
        const vendor = request.body.vendor;
        const username = request.body.username;
        const budget = request.body.budget;
        const currentExpense = {ID:null};
        const currentBudget = {ID:null};
        const currentUser = {ID:null};

    //Insert Expense
        //Build query for item
        const expenseQuery = "INSERT INTO expense SET ID = null, date = STR_TO_DATE(?, '%Y-%m-%d'), vendor = ?, item = ?, price = ?";
        const expenseInserts = [date, vendor, item, price];
        console.log('variables: ','date: ', date, ', vendor: ',vendor, ', item:', item, ', price: ', price);
        const expenseSql = mysql.format(expenseQuery, expenseInserts);

        //Build query to check if item already within database
        const expenseCheckQuery = "SELECT ID FROM item WHERE date = ? AND name = ? AND price = ?";
        const expenseCheckInserts = [date, item, price];
        const expenseCheckSql = mysql.format(expenseCheckQuery, expenseCheckInserts);

        //Run query to check for item and insert if not in database
        database.query(expenseCheckSql, (error, data, fields) => {
            if(!data){
                 database.query(expenseSql, (error, data, fields)=>{
                    if(!error){
                        currentExpense.ID = data.insertId;
                        console.log('Expense successfully inputted.');
                        return currentExpense.ID;
                     } else {console.log('Expense failed to be inputted.');
                     console.log('Expense Query: ',expenseSql);
                     console.log('error: ', error);
        }});} else{
                    currentExpense.ID=data[0]['ID'];
        }});

    //Obtain budget ID of budget inputted
        const budgetIDQuery = "SELECT ID from budget WHERE name = ?";
        const budgetIDInserts = [budget];
        const budgetIDSql = mysql.format(budgetIDQuery,budgetIDInserts);
        

        database.query(budgetIDSql,(error, data, fields) => {
            if(!error){
                console.log('data: ', data);
                console.log('data0: ', data[0]);
                currentBudget.ID = data[0]['ID'];
                console.log('Budget ID: ', currentBudget.ID);
                console.log('Budget successfully found.')
                return currentBudget.ID;
            } else {console.log('Failed to find budget.')}
        });


    //Obtain username ID of username inputted
        const usernameIDQuery = "SELECT ID from user WHERE username = ?";
        const usernameIDInserts = [username];
        const usernameIDSql = mysql.format(usernameIDQuery, usernameIDInserts);

        database.query(usernameIDSql, (error, data, fields)=>{
            if(!error){
                currentUser.ID = data[0]['ID'];
                console.log('Username ID found.');
                return currentUser.ID;
            } else {
                console.log('Could not find username.');
            }
        });

    //Insert into budget expense table
        function getIDs(){    
            if(currentExpense.ID && currentBudget.ID && currentUser.ID){
            const budgetExpenseQuery = "INSERT INTO budget_expense SET ID = null, budget_id = ?, expense_id = ?, user_id = ?";
            const budgetExpenseInserts = [currentBudget.ID, currentExpense.ID, currentUser.ID];
            const budgetExpenseSql = mysql.format(budgetExpenseQuery, budgetExpenseInserts);

            database.query(budgetExpenseSql, (error, data, fields) => {
                if(!error){
                    console.log('Successfully submited to budget_expense table.');
                    updateBudgetAmount(currentBudget.ID);
                } else {
                    console.log('Failed to submit to budget_expense table.')
                }
                });
            } else {
                console.log('trying again');
                setTimeout(getIDs,1000);
            }
        };

        getIDs();
});



function updateBudgetAmount(budgetID){
    const budgetRemaining = {amount: null};
    const calculateRemainingQuery = `SELECT (b.amount - SUM(e.price)) AS remaining
    FROM expense AS e
    JOIN budget_expense as be
    ON e.ID = be.expense_id
    JOIN budget AS b 
    ON be.budget_id = b.ID
    WHERE be.budget_id = ?`;
    
    const calculateRemainingInserts = [budgetID];
    const calculateRemainingSql = mysql.format(calculateRemainingQuery, calculateRemainingInserts);

    database.query(calculateRemainingSql, (error, data, fields) => {
        if(!error){
            budgetRemaining.amount = data[0]['remaining'];
            console.log('Remaining amount successfully calculated.')

            const updateBudgetQuery = "UPDATE budget AS b SET b.remaining = ?";
            const updateBudgetInserts = [budgetRemaining.amount];
            const updateBudgetSql = mysql.format(updateBudgetQuery, updateBudgetInserts);
            database.query(updateBudgetSql, (error, data, fields)=>{
                if(!error){
                    console.log('Budget remaining amount successfully updated.')
                } else {
                    console.log('Budget failed to update.')
                }
            })
        } else {
            console.log('Remaining budget failed to calculate.')
        }
    })

};

}