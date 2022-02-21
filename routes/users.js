const express = require('express');
const {User,validate} = require("../models/user");
const router = express.Router();
const data = require('../data');
const bcrypt = require('bcrypt');

const _= require('lodash');
const Joi = require('joi');

router.get('/seed',async(req,res)=>{
    await User.remove({})
    await User.insertMany(data.users);
    let user = await User.find();
    res.send(user)
})
router.post("/signup",async(req,res)=>{
   
    const {error} = validate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send({message:"Email address is already exist"});

    user = new User(_.pick(req.body,["name","email","password"]));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();

    let token = user.generateToken();
    res.header("x-auth-token",token).send(_.pick(req.body,["name","email"]))
})

router.post("/signin",async(req,res)=>{
    const {error} = signInValidate(req.body);
    if(error) return res.status(400).send({message:error.details[0].message});
    
    let user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send({message:"Email address doesn't exist"});

    let isValid= await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(400).send({message:"Invalid Password"});

    let token = user.generateToken();

    res.header("x-auth-token",token).send({
        name:user.name,
        email:user.email,
        token
    })

})

function signInValidate(user){
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().required()
    })
    return schema.validate(user)
}
module.exports=router;

