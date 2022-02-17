const Joi = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        // required:true
    },
    brand:{
        type:String,
        // required:true,
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    numReviews:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    numberInstock:{
        type:Number,
        required:true
    }
})

const Product = mongoose.model("Product",productSchema);

function productValidate(product){
    const schema = Joi.object({
        name:Joi.string().required(),
        price:Joi.number().required(),
        description:Joi.string().required(),
        rating:Joi.number().required(),
        numReviews:Joi.number().required(),
        image:Joi.string().required(),
        numberInstock:Joi.number().required()
    })
    return schema.validate(product)
}
exports.Product = Product;
exports.validate = productValidate;

