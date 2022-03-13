const express = require('express');
const {User,validate} = require("../models/user");
const router = express.Router();
const data = require('../data');
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const admin = require('../middleware/admin');
const _= require('lodash');
const Joi = require('joi');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/topsellers',async(req,res)=>{
    let users = await User.find({isSeller:true}).sort({"seller.rating":-1}).select({name:1,email:1,isSeller:1,seller:1});
    res.send(users);
})


router.put('/:id',[validateObjectId,auth,admin],async(req,res)=>{
    let user = await User.findById(req.params.id);
    if(!user) return res.status(404).send({message:"User not found"});
    user.name= req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;
    user.isSeller = req.body.isSeller;
    user = await user.save();
    res.send(user);
})

router.delete('/:id',[validateObjectId,auth,admin],async(req,res)=>{
    let users = await User.findByIdAndDelete(req.params.id);
    res.send(users);
});

router.get("/",[auth,admin],async(req,res)=>{
    let users = await User.find();
    res.send(users);
})

router.put('/profile',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(404).send({message:"User not found"});
    user.name = req.body.name;
    user.email = req.body.email;
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password,salt);
    }
    user = await user.save();
    let token = user.generateToken();
    res.send({name:user.name,email:user.email,isAdmin:user.isAdmin,token,id:user._id});

});

router.get('/:id',auth,async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send({message:"User not found"});
    res.send({_id:user._id,name:user.name,email:user.email,isAdmin:user.isAdmin,isSeller:user.isSeller,seller:user.seller});
});

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
    res.header("x-auth-token",token).send({name:user.name,email:user.email, isAdmin:user.isAdmin,token,id:user._id, isSeller:user.isSeller})
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
        isAdmin:user.isAdmin,
        token,
        id:user._id,
        isSeller:user.isSeller
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

