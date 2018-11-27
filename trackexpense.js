const mysql = require('mysql');

module.exports = (app, database) => {
    console.log('connected to trackexpense');
    app.post('/submitExpense', (request, response)=>{
        // console.log('item name: ', request.body.item);
        // console.log('item price: ', request.body.price);
        // console.log('vendor: ', request.body.vendor);
        // console.log('item category: ', request.body.category);
        response.send('Thank you for submitting an expense');

        const item = request.body.item;
        const price = request.body.price;
        const vendor = request.body.vendor;
        const category = request.body.category;
        
        // Query to item
        const itemQuery = "INSERT INTO item SET ID = null, name = ?, unit_price = ?";
        const itemInserts = [item, price];
        const itemSql = mysql.format(itemQuery, itemInserts);

        database.query(itemSql, (error, data, fields)=>{
            if(!error){
                console.log('Item successfully inputted.');
             } else {console.log('Item failed to be inputted.');}
        });
        // Query to vendor
        const vendorQuery = "INSERT INTO vendor SET ID = null, name = ?";
        const vendorInserts = [vendor];
        const vendorSql = mysql.format(vendorQuery, vendorInserts);

        database.query(vendorSql, (error, data, fields)=>{
            if(!error){
                console.log('Vendor successfully inputted.');
             } else {console.log('Vendor failed to be inputted.');}
        });

        // Query to category
        const categoryQuery = "INSERT INTO category SET ID = null, name = ?";
        const categoryInserts = [category];
        const categorySql = mysql.format(categoryQuery, categoryInserts);

        database.query(categorySql, (error, data, fields)=>{
            if(!error){
                console.log('Category successfully inputted.');
             } else {console.log('Category failed to be inputted.');}
        });

    });
};
