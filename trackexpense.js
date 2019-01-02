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

        const itemCategoryID = {itemID: null, categoryID: null};

           //Run query to check for category and insert if not in database
           database.query(categoryCheckSql, (error, data, fields) => {
            if(!data.length){
                database.query(categorySql, (error, data, fields)=>{
                    if(!error){
                        console.log('Category successfully inputted.');
                            //Obtain item information
                            const itemIDQuery = "SELECT ID FROM item AS i WHERE i.name = ? AND i.unit_price = ?";
                            const itemInsert = [item, price];
                            const itemIDSQL = mysql.format(itemIDQuery, itemInsert);
                            database.query(itemIDSQL, (error, data, fields) => {
                                if(!error && data.length){
                                    console.log('Item Working');
                                    const itemID = data[0]['ID']; 
                                    itemCategoryID['itemID'] = itemID;
                                    console.log('ItemID: ', itemID);
                                } else {console.log('Could not find item')}
                            })

                            //Obtain category information
                            const categoryIDQuery = "SELECT ID FROM category AS c WHERE c.name = ?";
                            const categoryIDSQL = mysql.format(categoryIDQuery, category);
                            database.query(categoryIDSQL, (error, data, fields) => {
                                if(!error && data.length){
                                    console.log('Category Working');
                                    const categoryID = data[0]['ID'];
                                    itemCategoryID['categoryID'] = categoryID;
                                    
                            //Populate item_category table---
                            if(itemCategoryID['itemID'] && itemCategoryID['categoryID']){
                                const itemCategoryQuery = "INSERT INTO item_category SET ID = null, item_id = ?, category_id";
                                const itemCategoryInserts = [itemCategoryID['itemID'], itemCategoryID['categoryID']];
                                const itemCategorySQL = mysql.format(itemCategoryQuery, itemCategoryInserts);
                                database.query(itemCategorySQL, (error, data, fields) => {
                                    console.log('error',error);
                                    if(!error){
                                        console.log('item_category table successfully populated');
                                    } else {
                                        console.log('Failed to populate item_category table');
                                    }
                                });
                            }
                                } else {console.log('Could not find category')}
                            })
                            console.log(itemCategoryID);

                            


                     } else {console.log('Category failed to be inputted.');
        }});}})

    //Create transaction
     //Build query for category
    //  const transactionQuery = "INSERT INTO transaction SET ID = null, user_id = ?";
    //  const transactionInserts = [category];
    //  const transactionSql = mysql.format(categoryQuery, categoryInserts);

    //  //Build query to check if category already within database
    //  const categoryCheckQuery = "SELECT ID FROM category WHERE name = ?";
    //  const categoryCheckSql = mysql.format(categoryCheckQuery, categoryInserts);

    //     //Run query to check for category and insert if not in database
    //     database.query(categoryCheckSql, (error, data, fields) => {
    //      if(!data.length){
    //          database.query(categorySql, (error, data, fields)=>{
    //              if(!error){
    //                  console.log('Category successfully inputted.');
    //               } else {console.log('Category failed to be inputted.');
    //  }});}})



    });
};
