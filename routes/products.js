const express = require('express');
const router = express.Router();
const data = require('../data');
const { Product } = require('../models/product');


router.get('/',async(req,res)=>{
    let products = await Product.find();
    res.send(products);
})

router.get('/seed',async(req,res)=>{
    await Product.remove({});
    let products = await Product.insertMany(data.products);
    res.send(products)
})
router.get('/:id',async(req,res)=>{
    let product = await Product.findById(req.params.id);
    if(product) return res.send(product);
    else return res.status(404).send({message:"Product not found"})
})
module.exports=router;