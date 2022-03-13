let request = require('supertest')
let mongoose = require('mongoose');
const { Order } = require('../../../models/order');
const { Product } = require('../../../models/product');
const { User } = require('../../../models/user');


describe('order test', () => {
    beforeEach(()=>{
        server = require('../../../index');
    });
    afterEach(async()=>{
        server.close();
       await Order.remove();
       await User.remove();
     
    })
    let order;
    
    let users;
    let sellerToken;
    let userToken;
    let product;
    let seller;
    let sellerObj;
    let userId=mongoose.Types.ObjectId();
    let sellerId=mongoose.Types.ObjectId();
    let adminId= mongoose.Types.ObjectId();
    let adminToken;
    let adminObj;
   
    beforeEach(async()=>{
        let userObj = {_id:userId,email:"akk@gmail.com",password:"akk12345",name:"test"};
        users= new User(userObj);
        userToken =  users.generateToken();
        users= await users.save();
       
        sellerObj = {_id:sellerId,email:"nssh@gmail.com",
        password:"nssh12345",name:"nssh",isSeller:true,isAdmin:false}
       
        seller = new User(sellerObj);
        sellerToken = seller.generateToken();
        seller = await seller.save();

        adminObj ={_id:adminId,email:"admin@gmail.com",password:"admin",name:"admin",isSeller:false,isAdmin:true}
        adminToken = new User(adminObj).generateToken();


        product = new Product({
            name:"product1",
            category:"test1",
            brand:"test1",
            price:10,
            description :"lorem ispum",
            rating:10,
            numReviews:3,
            numberInstock:10,
            seller:seller._id,
            image:'/images/akk.jpg'
        })
        product = await product.save();
        order = new Order({
            orderItems:[
                {
                    name:"product",
                    image:'/images/akk.jpg',
                    numberInstock:10,
                    price:20,
                    qty:2,
                    product:product._id
                }
            ],
            shippingAddress:{
                fullName:"Aung Kaung Khant",
                address:"GE",
                city:"Pyin Oo Lwin",
                postalCode:"123",
                country:"Myanmar"
            },
            paymentMethod:"Paypal",
            itemsPrice:40,
            taxPrice :10,
            totalPrice:50,
            seller:sellerId,
            shippingPrice:0,
            user:userId

        });
        order = await order.save();
    })

    let exec =()=>{
        let orderItems=[
            {
                name:"product1",
                image:'/images/akk.jpg',
                numberInstock:11,
                price:21,
                qty:2,
                product:mongoose.Types.ObjectId()
            }
        ];
        let shippingAddress={
            fullName:"Aung Kaung Khant",
            address:"GE",
            city:"Pyin Oo Lwin",
            postalCode:"123",
            country:"Myanmar"
        }
        let paymentMethod = "Paypal";
        let itemsPrice=40;
        let shippingPrice = 0;
        let taxPrice =10;
        let totalPrice=50;
        let sellerId = mongoose.Types.ObjectId();
        return request(server).post("/api/orders").set("authorization",`Bearer ${sellerToken}`).send({orderItems,shippingAddress,paymentMethod,itemsPrice,shippingPrice,taxPrice,totalPrice,sellerId});
        
    }
    // it('POST /order', async() => {
    //     let result = await exec();
    //     expect(result.status).toBe(201);
    // });
    it("GET /order user is seller or admin",async()=>{
         let result =  await request(server).get('/api/orders').set("authorization",`Bearer ${sellerToken}`);
        expect(result.status).toBe(200);
    });
    it("GET /order user is seller",async()=>{
        let result = await request(server).get(`/api/orders?seller=${sellerId}`).set("authorization",`Bearer ${sellerToken}`);
        expect(result.status).toBe(200);
        expect(result.body.orders[0].seller).toEqual(seller._id.toString());
    });
    it("should return corresponding order from user_id",async()=>{
        let result = await request(server).get('/api/orders/mine').set("authorization",`Bearer ${userToken}`);
        expect(result.status).toBe(200)
    });
    it("should return order paid message when user is paid",async()=>{
        let result = await request(server).put(`/api/orders/${order._id}/pay`).set("authorization",`Bearer ${userToken}`).send({_id:1,status:true,update_time:Date.now().toLocaleString(),email_address:"akk@gmail.com"});
        expect(result.status).toBe(200)
        expect(result.body.message).toBe('Order paid');
        expect(result.body.orders.isPaid).toBe(true);
    })
    it("should return isdelivered true and delivered message if click user is admin",async()=>{
        let result = await request(server).put(`/api/orders/${order._id}/deliver`).set("authorization",`Bearer ${adminToken}`)
        expect(result.body.orders.isDelivered).toBe(true);
    })
    it("should return order summary if user is admin",async()=>{
        let result = await request(server).get(`/api/orders/summary`).set("authorization",`Bearer ${adminToken}`);
        expect(result.status).toBe(200);
    })
});
