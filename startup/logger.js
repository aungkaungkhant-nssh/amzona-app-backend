const winston = require('winston');
const logger = winston.createLogger({
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({
            level:"error",
            filename:"error.log"
        })
    ]
})

module.exports=logger;