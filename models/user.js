const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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
    
    }
})
userSchema.methods.generateToken = function (){
    return jwt.sign({_id:this._id,isAdmin:this.isAdmin},process.env.JWT_KEY)
}
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


