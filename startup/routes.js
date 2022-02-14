const products = require('../routes/products');
const express = require('express')
const errors = require('../middleware/errors')
module.exports = function(app){
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use("/api/products",products);
    app.use(errors)
}