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
        default:false,
    },
    isSeller:{
        type:Boolean,
        default:false
    },
    seller: {
        name: String,
        logo: String,
        description: String,
        rating: { type: Number, default: 0, required: true },
        numReviews: { type: Number, default: 0, required: true },
      },
})
userSchema.methods.generateToken = function (){
    return jwt.sign({_id:this._id,isAdmin:this.isAdmin,isSeller:this.isSeller},process.env.JWT_KEY)
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


