const logger = require('../startup/logger')
module.exports = function(err,req,res,next){
    logger.log("error",err.message)
    res.status(500).send("Something went wrong....");
}