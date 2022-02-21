const express = require("express");
const auth = require("../middleware/auth");
const { Order } = require("../models/order");
const router = express.Router();

router.post('/',auth,async(req,res)=>{
    if(req.body.orderItems.length === 0){
        res.status(400).send({message:"Cart is empty"})
    }else{
        let order = new Order({
            orderItems:req.body.orderItems,
            shippingAddress:req.body.shippingAddress,
            paymentMethod : req.body.paymentMethod,
            itemsPrice : req.body.itemsPrice,
            shippingPrice : req.body.shippingPrice,
            taxPrice : req.body.taxPrice,
            totalPrice : req.body.totalPrice,
            user:req.user._id
        })
        order = await order.save();
        res.status(201).send({message:"New Order Created",order})
    }
})

module.exports=router;