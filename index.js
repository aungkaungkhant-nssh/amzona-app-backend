require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./startup/logger');


require('./startup/routes')(app)
require('./startup/logging')();
require('./startup/db')(logger);



let port = process.env.PORT || 4000;

app.listen(port,function(){
   logger.log({level:"info",message:`Server is running on port ${port}`})
})

