const mongoose = require('mongoose');
const config = require("config");
module.exports=function(logger){
    mongoose.connect(config.get("db"))
         .then(()=> logger.log({level:"info",message:`Connected to ${config.get("db")}`}))
         .catch(()=> logger.log({level:"info",message:err.message}))
}