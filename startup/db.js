const mongoose = require('mongoose')
module.exports=function(logger){
    mongoose.connect("mongodb://localhost/amazona")
         .then(()=> logger.log({level:"info",message:"Connected to mongodb://localhost/amazona"}))
         .catch(()=> logger.log({level:"info",message:err.message}))
}