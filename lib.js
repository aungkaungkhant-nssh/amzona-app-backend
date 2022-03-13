const db=require('./libdata');
module.exports.applyDiscount = function(id){
    let customer = db.getCustomerSync(id);
    let order = {price:10};
    if(customer.point>10){
        order.price *=0.9;
    }
    return order.price;
}