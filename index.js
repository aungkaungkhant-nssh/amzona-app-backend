const express = require('express');
const app = express();
const products = require('./routes/products');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products",products);


app.listen(5000,function(){
    console.log("Server is running on port 5000");
})

