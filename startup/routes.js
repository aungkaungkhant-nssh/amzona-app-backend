const products = require('../routes/products');
const users = require('../routes/users');
const orders = require('../routes/orders')
const express = require('express')
const errors = require('../middleware/errors')
module.exports = function(app){
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use("/api/products",products);
    app.use("/api/users",users);
    app.use("/api/orders",orders)
    app.use(errors)
}