const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        defalult:false,
        required:true
    }
})
const User = mongoose.model("User",userSchema);

function userValidate(user){
    const schema = Joi.object({
        name:Joi.string().required(),
        email:Joi.string().email().required(),
        password:Joi.string().required()
    })
    return schema.validate(user)
}
exports.User=User;
exports.validate=userValidate;


