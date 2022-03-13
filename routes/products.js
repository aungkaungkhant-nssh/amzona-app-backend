const express = require('express');
const router = express.Router();
const data = require('../data');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Product } = require('../models/product');
const validateObjectId = require('../middleware/validateObjectId');


router.post('/:id/reviews',[validateObjectId,auth],async(req,res)=>{
    let product = await Product.findById(req.params.id);

    if(!product) return res.status(404).send({messsage:"Product not found"});

    if(product.reviews.find((r)=> r.name===req.body.name)) return res.status(400).send({message:"You already submitted review"});

    const reviews={name:req.body.name,comment:req.body.comment,rating:Number(req.body.rating)};

    product.reviews.push(reviews);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a,c)=> c.rating+a,0)/product.reviews.length;
    product = await product.save();
    res.status(201).send({message:"Review Created",review:product.reviews[product.reviews.length-1]})
})

router.get('/categories',async(req,res)=>{
    let categories =await Product.find().distinct("category");
   
    res.send(categories);
})

router.get('/',async(req,res)=>{
    let pageSize = 3;
    let seller = req.query.seller || "";
    let page = Number(req.query.pageNumber ) || 1;
    let name = req.query.name || "";
    let category = req.query.category || "";
    let order = req.query.order || "";
    let min = req.query.min && Number(req.query.min) !==0 ? Number(req.query.min) : 0;
    let max =req.query.max && Number(req.query.max) !==0 ? Number(req.query.max) : 0;
    let rating= req.query.rating && Number(req.query.rating) !==0 ? Number(req.query.rating) : 0;

    const sortOrder = 
        order==="lowest" 
        ? {price:1}
        : order==="highest"
        ? {price:-1}
        : order==="toprated"
        ? {rating:-1}
        : { _id:-1};
    
    let sellerFilter = seller ? {seller} :{};
    let nameFilter = name ? { name: { $regex: name, $options: 'i' } } :{};
    
    let categoryFilter = category ? {category} :{};
    let priceFilter = min && max ? {price:{$gte:max,$lte:min}}:{};
    let ratingFilter = rating ? {rating:{$gte:rating}} : {};

    let count = await Product.count({   // collection count
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
    })

    let products = await Product.find({
        ...sellerFilter,
        ...nameFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter
    })
    .sort(sortOrder)
    .skip(pageSize * (page-1))
    .limit( Number(req.query.pageNumber ) ? pageSize : "");
    ;
    
    res.send({products,page,pages:Math.ceil(count/pageSize)});
})



router.put('/:id',[validateObjectId,auth,admin],async(req,res)=>{
    let product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send({message:"Product not found"});
    product.name= req.body.name || product.name;
    product.category= req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.numberInstock = req.body.numberInstock || product.numberInstock;
    product.image = req.body.image || product.image;
    product = await product.save();
    res.send({message:"Product Updated",product});
})

router.get('/seed',async(req,res)=>{
    await Product.remove({});
    let products = await Product.insertMany(data.products);
    res.send(products)
})
router.get('/:id',validateObjectId,async(req,res)=>{
    let product = await Product.findById(req.params.id).populate("seller",  'seller.name seller.logo seller.rating seller.numReviews');
    
    if(product) return res.send(product);
    else return res.status(404).send({message:"Product not found"})
})
router.post("/",[auth,admin],async(req,res)=>{
    let  product = new Product({
        name:"sample name"+Date.now(),
        category:"sample category",
        brand:"sample brand",
        price:10,
        description: "sample description",
        rating:0,
        numReviews:0,
        image: '/images/p1.jpg',
        numberInstock:10
    });
    product = await product.save();
    res.send(product);
})
router.delete('/:id',[validateObjectId,auth,admin],async(req,res)=>{
   let product = await Product.findByIdAndDelete(req.params.id);
   res.send({message:"Product Delete",product});
   
})



module.exports=router;

