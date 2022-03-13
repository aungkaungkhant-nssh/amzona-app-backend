const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const isSellerOrAdmin = require('../middleware/selleroradmin');
const validateObjectId = require("../middleware/validateObjectId");
const {sendMail} = require('../util');
const { Order } = require("../models/order");
const router = express.Router();
const {Product} = require('../models/product');
const {User} = require('../models/user');

router.get('/summary',[auth,admin],async(req,res)=>{
    const orders = await Order.aggregate([
        {
            $group:{
                _id:null,
                numOrders:{$sum:1},
                totalPrice:{$sum:"$totalPrice"}
            }
        }
    ]);
    const users = await User.aggregate([
        {
            $group:{
                _id:null,
                numUsers:{$sum:1}
            }
        }
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group:{
                _id:{$dateToString:{format:'%Y-%m-%d',date:"$createdAt"}},
                orders:{$sum:1},
                sales:{$sum:"$totalPrice"}
            }
        }
    ]);
    const productCategories = await Product.aggregate([
        {
            $group:{
                _id:'$category',
                count:{$sum:1}
            }
        }
    ])
    res.send({ users, orders, dailyOrders, productCategories });
})

router.get('/mine',auth,async(req,res)=>{
    let orders = await Order.find({user:req.user._id});
    if(!orders) return res.status(404).send({message:"Order not found"});
    res.send(orders)
});

router.get("/",[auth,isSellerOrAdmin],async(req,res)=>{
    let pageSize=5;
    let page = Number(req.query.pageNumber) || 1;
    let seller = req.query.seller || "";
    let sellerFilter = seller ? {seller} :{};
    let ordersCount = await Order.count(sellerFilter);
    let orders = await Order.find(sellerFilter).populate("user")
                .skip(pageSize * (page-1))
                .limit(pageSize)
                .sort({_id:-1});
    
    res.send({orders,pages:Math.ceil(ordersCount/pageSize)});
});

router.delete("/:id",[auth,admin],async(req,res)=>{
    let order= await Order.findByIdAndDelete(req.params.id);
    res.send({message:"Order deleted",order})
});

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
            user:req.user._id,
            seller:req.body.sellerId || null
        })
        order = await order.save();
      
        res.status(201).send({message:"New Order Created",order})
    }
})
router.get("/:id",[auth,validateObjectId],async(req,res)=>{
    let orders = await Order.findById(req.params.id);
    if(!orders) return res.status(404).send({message:"Order not found"});
    res.send(orders)
})

router.put('/:id/pay',[auth,validateObjectId],async(req,res)=>{
    
    let orders = await Order.findById(req.params.id).populate("user");
    if(!orders) return res.status(404).send({messge:"Order not found"});
    
    orders.isPaid = true;
    orders.paidAt = Date.now();
    orders.paymentResult={
        id:req.body._id,
        status:req.body.status,
        update_time:Date.now().toString(),
        email_address:req.body.email_address
    }
    orders=await orders.save();
    sendMail(
        req.body.email_address,
        orders._id,
        orders.user.name,
        orders.createdAt,
        orders.orderItems,
        orders.itemsPrice,
        orders.shippingPrice,
        orders.taxPrice,
        orders.totalPrice,
        orders.shippingAddress.fullName,
        orders.shippingAddress.address,
        orders.shippingAddress.city,
        orders.shippingAddress.country,
        orders.shippingAddress.postalCode
        );
    res.send({message:"Order paid",orders})
})

router.put('/:id/deliver',[validateObjectId,auth,admin],async(req,res)=>{
    let orders = await Order.findById(req.params.id);
    if(!orders) return res.status(404).send({messge:"Order not found"});
    orders.isDelivered = true;
    orders.deliveredAt = Date.now();
    orders = await orders.save();
    res.send({message:"Order deliver",orders});
});


module.exports=router;
