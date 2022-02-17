const express = require('express');
const router = express.Router();
const data = require('../data')


router.get('/',(req,res)=>{
    res.send(data.products)
})
router.get('/:id',(req,res)=>{
    console.log(req.params)
    const product = data.products.find((p) => p._id===+req.params.id);
    if(product){
        res.send(product)
    }else{
        res.status(404).send({message:"Product not found"})
    }
})
module.exports=router;