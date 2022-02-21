const jwt = require("jsonwebtoken")
module.exports = function(req,res,next){
    const authorization = req.header.authorization;
    if(!authorization) return res.status(401).send({message:"Access denied no provided token..."})

    const token = authorization.slice(authorization,7);
    try{
        let decode = jwt.verify(token,process.env.JWT_KEY);
        req.user = decode;
        next()
    }catch(err){
        res.status(400).send("Invalid token")
    }
}