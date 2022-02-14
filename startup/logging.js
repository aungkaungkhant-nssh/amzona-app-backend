const winston = require("winston")
const logger = require("./logger")

module.exports = function(){
    process.on("uncaughtException",(ex)=>{
        logger.log("error",ex.message)
        process.exit(1)
    })
    winston.exceptions.handle(
        new winston.transports.File({filename:"uncaughtException.log"})
    )
    process.on("unhandledRejection",(ex)=>{
        throw(ex);
   
    })
}