const mysql = require('mysql');
const express = require('express');
const app = express();
const db = require('./webserver.js');

const submitExpense = (app.post('/submitExpense', (request, response)=>{
    // console.log('request item:', request.body.item);
    console.log('item name: ', request.body.item);
    console.log('item price: ', request.body.price);
    console.log('vendor: ', request.body.vendor);
    console.log('item category: ', request.body.category);
}));

module.exports = submitExpense;