const products = require('../routes/products');
const users = require('../routes/users');
const orders = require('../routes/orders')
const express = require('express')
const errors = require('../middleware/errors');
const uploads = require('../routes/upload');

const path = require('path')
module.exports = function(app){
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    const __dirname = path.resolve();
    
    app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
    
    app.use("/api/products",products);
    app.use("/api/users",users);
    app.use("/api/orders",orders);
    app.use("/api/uploads",uploads);
   
    app.use(errors);
}