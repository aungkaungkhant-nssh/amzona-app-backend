const nodemailer = require('nodemailer');
module.exports.sendMail = function(useremail,orderId,name,createdAt,orderItems,itemsPrice,shippingPrice,taxPrice,totalPrice,fullName,address,city,country,postalCode){
        // const __dirname = path.resolve();
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"aungkaungkhantakk123321@gmail.com",
                pass:"09772304598"
            }
        })
       
        const options ={
            from:"aungkaungkhantakk123321@gmail.com",
            to:`${useremail}`,
            subject: `New Order ${orderId}`,
            // template:"index"
            html:`
            Hi ${name},</p>
            <p>We have finished processing your order.</p>
            <h2>[Order ${orderId}] (${createdAt.toString().substring(0, 10)})</h2>
            <table>
            <thead>
                <tr>
                    <td><strong>Product</strong></td>
                    <td><strong>Quantity</strong></td>
                    <td><strong align="right">Price</strong></td>
                </tr>
            </thead>
            <tbody>
                ${orderItems
                    .map(
                    (item) => `
                    <tr>
                    <td>${item.name}</td>
                    <td align="center">${item.qty}</td>
                    <td align="right"> $${item.price.toFixed(2)}</td>
                    </tr>
                `
                    )
                    .join('\n')}
            </tbody>
            <tfoot>
            <tr>
            <td colspan="2">Items Price:</td>
            <td align="right"> $${itemsPrice.toFixed(2)}</td>
            </tr>
            <tr>
            <td colspan="2">Tax Price:</td>
            <td align="right"> $${taxPrice.toFixed(2)}</td>
            </tr>
            <tr>
            <td colspan="2">Shipping Price:</td>
            <td align="right"> $${shippingPrice.toFixed(2)}</td>
            </tr>
            <tr>
            <td colspan="2"><strong>Total Price:</strong></td>
            <td align="right"><strong> $${totalPrice.toFixed(2)}</strong></td>
            </tr>
            </table>
            <h2>Shipping address</h2>
            <p>
            ${fullName},<br/>
            ${address},<br/>
            ${city},<br/>
            ${country},<br/>
            ${postalCode}<br/>
            </p>
            <hr/>
            <p>
            Thanks for shopping with us.
            </p>
            `
        }
        
        transporter.sendMail(options,function(error,info){
            if(error){
                console.log(error.message)
            }else{
                console.log(info.response)
            }
        })

}