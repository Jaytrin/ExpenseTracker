const mysql = require('mysql');

module.exports = (app, database) => {
    console.log('connected to trackexpense');

    //Endpoint to submit a budget
    app.post('/submitBudget', (request, response)=>{
        const username = request.body.username;
        const budget = request.body.budget;
        const amount = request.body.amount;
        const checkBudget = {budgetID: null, userID: null};
    //Adjust amount remaining

    //Budget Section
        checkBudget['budgetID'] = getBudgetID(budget);
        checkBudget['userID'] = getUserID(username);
        //Check if user and budget already exists

        const checkBudgetQuery = "SELECT ID from budget WHERE ID = ?";
        const checkBudgetInserts = [ checkBudget['budgetID']];
        const checkBudgetSql = mysql.format(checkBudgetQuery, checkBudgetInserts);
        const checkBudgetUserQuery = "SELECT ID from budget_expense WHERE budget_id = ? AND user_id = ?";
        const checkBudgetUserInserts = [ checkBudget['budgetID'], checkBudget['userID']];
        const checkBudgetUserSql = mysql.format(checkBudgetUserQuery, checkBudgetUserInserts);

        database.query(checkBudgetSql, (error, data, fields)=> {
            if(error){
                console.log('Could not locate budget');
                database.query(checkBudgetUserSql, (error, data, fields)=> {
                    if(error){
                        console.log('Could not locate budget_user');
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

                        const budgetUserQuery = "INSERT INTO budget_user SET ID = null, budget_id = ?, user_id = ?";
                        const budgetUserInserts = [checkBudget.budgetID, checkBudget.userID];
                        const budgetUserSql = mysql.format(budgetUserQuery,budgetUserInserts);
                
                        database.query(budgetUserSql, (error, data, field) => {
                            if(!error){
                                console.log('Budget_user successfully submitted.');
                            } else {
                                console.log('Budget_user failed to submit');
                            }
                        });



                    }
                })
            }
        })

        //Build query for budget
        updateAllBudgets(username);
    });

    //Endpoint to get data for budget and expenses for a specific user
    app.post('/getData', async (request, response)=>{
        const username = request.body.username;
        await updateAllBudgets(username);
        getData();
    //Get budget Section

    function getData(){
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
                    rowData['budget'] = data[i]['budget'];
                    rowData['amount'] = data[i]['amount'];
                    rowData['remaining'] = data[i]['remaining'];
                    rowData['date'] = data[i]['date'];
                    rowData['vendor'] = data[i]['vendor'];
                    rowData['item'] = data[i]['item'];
                    rowData['price'] = data[i]['price'];
                   if(rowData){
                       displayData.push(rowData);
                   }
                }
                console.log('Budget successfully fetched.');
                console.log(displayData);
                response.send(JSON.stringify(displayData));
            } else {
                console.log('Budget failed to fetch');
            }
        })
    };
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
        // currentBudget.ID = await getBudgetID(budget);
        // currentUser.ID = await getUserID(username);
        const currentBudget = {ID:null};
        const currentUser = {ID:null};
        console.log('BudgetID solution: ', getBudgetID(budget))
        currentBudget.ID = getBudgetID(budget);
        console.log('getUserID solution: ', getUserID(username))
        currentUser.ID = getUserID(username);
    //Insert into budget_expense table
    function getIDs(){ 
            console.log('Username: ', username);
            console.log('budget: ', budget);
            if(currentExpense.ID && currentBudget.ID.ID && currentUser.ID.ID){
                console.log('triple check passed');
                console.log('expenseID: ', currentExpense.ID);
                console.log('currentBudget: ', currentBudget.ID);
                console.log('currentUser: ', currentUser.ID); 
            const budgetExpenseQuery = "INSERT INTO budget_expense SET ID = null, budget_id = ?, expense_id = ?, user_id = ?";
            const budgetExpenseInserts = [currentBudget.ID.ID, currentExpense.ID, currentUser.ID.ID];
            const budgetExpenseSql = mysql.format(budgetExpenseQuery, budgetExpenseInserts);

            database.query(budgetExpenseSql, (error, data, fields) => {
                if(!error){
                    console.log('Successfully submited to budget_expense table.');
                    updateAllBudgets(username);
                } else {
                    console.log('Failed to submit to budget_expense table.', error);
                }
                });
            } else {
                console.log('trying again-------------------------------------');
                console.log('expenseID: ', currentExpense.ID);
                console.log('currentBudget: ', currentBudget.ID);
                console.log('currentUser: ', currentUser.ID); 
                setTimeout(getIDs,1000);
            }
        };

        getIDs();
});



function updateBudgetAmount(budgetID){
    const budgetRemaining = {amount: null};

    const checkBudgetExpenseQuery = `SELECT ID from budget_expense WHERE budget_id = ?`;
    const budgetIDInsert = [budgetID];
    const checkBudgetExpenseSql = mysql.format(checkBudgetExpenseQuery, budgetIDInsert);

    database.query(checkBudgetExpenseSql, (error, data, fields) => {
        console.log('CurrentID: ', budgetIDInsert);
        console.log('error: ', error);
        console.log('length: ', data.length);
        if(!error && data.length){
            console.log('looking for data: ', data[0]);
            const calculateRemainingQuery = `SELECT (b.amount - SUM(e.price)) AS remaining, be.budget_id AS budget_identifier
            FROM expense AS e
            JOIN budget_expense AS be
            ON e.ID = be.expense_id
            JOIN budget AS b 
            ON be.budget_id = b.ID
            GROUP BY budget_identifier
            HAVING budget_identifier = ?`;
            
            const calculateRemainingSql = mysql.format(calculateRemainingQuery, budgetIDInsert);
        
            database.query(calculateRemainingSql, (error, data, fields) => {
                if(!error && data.length){
                    console.log('data value: ', data[0]);
                    budgetRemaining.amount = data[0]['remaining'];
                    console.log('Remaining amount successfully calculated.')
        
                    const updateBudgetQuery = "UPDATE budget AS b SET b.remaining = ? WHERE b.ID = ?";
                    console.log('BudgetID: ', budgetIDInsert);
                    console.log('remaining for update: ', budgetRemaining.amount);
                    const updateBudgetInserts = [budgetRemaining.amount, budgetIDInsert];
                    const updateBudgetSql = mysql.format(updateBudgetQuery, updateBudgetInserts);
                    database.query(updateBudgetSql, (error, data, fields)=>{
                        if(!error){
                            console.log('Budget remaining amount successfully updated.')
                        } else {
                            console.log('Budget failed to update.')
                        }
                    })
                } else {
                    console.log('Remaining budget failed to calculate.', error);
                }
            })
        } else {console.log('budget expense does not exist: ', budgetIDInsert);}
    })
};


function getUserID(username){
    const usernameIDQuery = "SELECT ID from user WHERE username = ?";
        const usernameIDInserts = [username];
        const usernameIDSql = mysql.format(usernameIDQuery, usernameIDInserts);
        const userObj = {ID: null};

        database.query(usernameIDSql, (error, data, fields)=>{
            if(!error){
                console.log('Username ID found.', data[0]['ID']);
                userObj['ID'] = data[0]['ID'];
            } else {
                console.log('Could not find username.');
            }
        });
        return userObj;
}

function getBudgetID(budget){
        //Obtain budget ID of budget inputted
        const budgetIDQuery = `SELECT ID from budget WHERE name = ?`;
        const budgetIDInserts = [budget];
        const budgetIDSql = mysql.format(budgetIDQuery,budgetIDInserts);
        const budgetObj = {ID: null};
        
        database.query(budgetIDSql,(error, data, fields) => {
            if(!error){
                budgetObj['ID'] = data[0]['ID'];
                console.log('Budget ID successfully found.', data[0]['ID'])
            } else {console.log('Failed to find budget.')}
        });
        return budgetObj;
}

function updateAllBudgets(username){
    const updateBudgetQuery = `SELECT bu.budget_id
                               FROM budget_user AS bu
                               JOIN user AS u
                               ON u.ID = bu.user_id
                               WHERE u.username = ?`;
    const updateBudgetInserts = [username];
    const updateBudgetSql = mysql.format(updateBudgetQuery, updateBudgetInserts);

    database.query(updateBudgetSql, (error, data, fields)=>{
        if(!error && data.length){
            for(let i = 0; i < data.length; i++){
                console.log('looping budgetID: ', data[i]);
                updateBudgetAmount(data[i]['budget_id']);
            }
        } else {
            console.log('Failed to update budgets');
        }
    })
}




}