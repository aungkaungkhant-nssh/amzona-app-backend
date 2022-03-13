const jwt = require("jsonwebtoken");
require('dotenv').config();
module.exports = function(req,res,next){
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).send({message:"Access denied no provided token..."})
    
    const token = authorization.slice(7,authorization.length);
 
    try{
        let decode = jwt.verify(token,process.env.JWT_KEY || "amazona_app_akk");
        req.user = decode;
        next()
    }catch(err){
        res.status(400).send("Invalid token")
    }
}