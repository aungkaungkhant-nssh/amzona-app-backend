const express = require('express');
const {User,validate} = require("../models/user");
const router = express.Router();
const data = require('../data')

router.get('/seed',async(req,res)=>{
    await User.insertMany(data.users);
    let user = await User.find();
    res.send(user)
})

module.exports=router;

