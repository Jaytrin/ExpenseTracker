const mysql = require('mysql');

module.exports = (app, database) => {
    console.log('connected to trackexpense');
    app.post('/submitExpense', (request, response)=>{
        response.send('Thank you for submitting an expense');

        const item = request.body.item;
        const price = request.body.price;
        const vendor = request.body.vendor;
        const category = request.body.category;
        
    //Item Section
        //Build query for item
        const itemQuery = "INSERT INTO item SET ID = null, name = ?, unit_price = ?";
        const itemInserts = [item, price];
        const itemSql = mysql.format(itemQuery, itemInserts);

        //Build query to check if item already within database
        const itemCheckQuery = "SELECT ID FROM item WHERE name = ? AND unit_price = ?";
        const itemCheckSql = mysql.format(itemCheckQuery, itemInserts);

        //Run query to check for item and insert if not in database
        database.query(itemCheckSql, (error, data, fields) => {
            if(!data.length){
                database.query(itemSql, (error, data, fields)=>{
                    if(!error){
                        console.log('Item successfully inputted.');
                     } else {console.log('Item failed to be inputted.');
        }});}})

    //Vendor Section
        //Build query for vendor
        const vendorQuery = "INSERT INTO vendor SET ID = null, name = ?";
        const vendorInserts = [vendor];
        const vendorSql = mysql.format(vendorQuery, vendorInserts);

        //Build query to check if vendor already within database
        const vendorCheckQuery = "SELECT ID FROM vendor WHERE name = ?";
        const vendorCheckSql = mysql.format(vendorCheckQuery, vendorInserts);

           //Run query to check for vendor and insert if not in database
           database.query(vendorCheckSql, (error, data, fields) => {
            if(!data.length){
                database.query(vendorSql, (error, data, fields)=>{
                    if(!error){
                        console.log('Vendor successfully inputted.');
                     } else {console.log('Vendor failed to be inputted.');
        }});}})

    //Category Section
        //Build query for category
        const categoryQuery = "INSERT INTO category SET ID = null, name = ?";
        const categoryInserts = [category];
        const categorySql = mysql.format(categoryQuery, categoryInserts);

        //Build query to check if category already within database
        const categoryCheckQuery = "SELECT ID FROM category WHERE name = ?";
        const categoryCheckSql = mysql.format(categoryCheckQuery, categoryInserts);

           //Run query to check for category and insert if not in database
           database.query(categoryCheckSql, (error, data, fields) => {
            if(!data.length){
                database.query(categorySql, (error, data, fields)=>{
                    if(!error){
                        console.log('Category successfully inputted.');
                     } else {console.log('Category failed to be inputted.');
        }});}})

    });
};
