let request = require('supertest');
let {Product} = require('../../../models/product');
let {User} = require('../../../models/user');
let mongoose = require('mongoose');

describe('product test', () => {
    beforeEach(()=>{
        server=require('../../../index');
        
    });
    afterEach(async()=>{
        
        await User.remove();
        await Product.remove();
        await server.close();
    })
    let users;
    let token;
    beforeEach(async()=>{
        let userObj = {_id: mongoose.Types.ObjectId(),email:"test123@gmail.com",password:"akk12345",name:"test",isAdmin:true};
        users= new User(userObj);
        token = users.generateToken();
        users= await users.save();
    })
    
    let exec = ()=>{
        let data =[
            {
                name:"product1",
                category:"test1",
                brand:"test1",
                price:10,
                description :"lorem ispum",
                rating:10,
                numReviews:3,
                numberInstock:10,
                seller:users._id,
                image:'/images/akk.jpg'
            },
            {
                name:"product2",
                category:"test2",
                brand:"test2",
                price:10,
                description :"lorem ispum",
                rating:10,
                numReviews:3,
                numberInstock:10,
                seller:users._id,
                image:'/images/akk.jpg'
            }
        ]
        return Product.collection.insertMany(data);
    }
    let createSingleProduct = ()=>{
        let product = new Product({
            name:"product",
            category:"test",
            brand:"test",
            price:10,
            description :"lorem ispum",
            rating:10,
            numReviews:3,
            numberInstock:10,
            seller:users._id,
            image:'/images/akk.jpg'
        });
       return product.save();
    }
    it("GET / product",async()=>{       
        await exec();
        let result = await request(server).get('/api/products');
        expect(result.status).toBe(200);
        // expect(result.body.products).toMatchObject(data);
    })
    it("GET /:id product",async()=>{
       let product = await createSingleProduct();
       let result = await request(server).get(`/api/products/${product._id}`);
       expect(result.status).toBe(200)
    })
    it("POST / product",async()=>{
       let result = await request(server).post('/api/products').set("authorization",`Bearer ${token}`);
       expect(result.status).toBe(200);
    });
    it("DELETE /:id product",async()=>{
        let product = await createSingleProduct();
        let result = await request(server).delete(`/api/products/${product._id}`).set("authorization",`Bearer ${token}`);
        expect(result.status).toBe(200);
    })
    it("PUT /:id product",async()=>{
        let product = await createSingleProduct();
        let result = await request(server).put(`/api/products/${product._id}`).send({name:"update product"}).set("authorization",`Bearer ${token}`);
        expect(result.status).toBe(200);
    })
    it("category / from product",async()=>{
         await exec();
         let categories = ["test1","test2"];
         let result = await request(server).get(`/api/products/categories`);
         expect(result.body).toEqual(expect.arrayContaining(categories));
    })
    it("reviews /:id from product",async()=>{
        let product = await createSingleProduct();
        let review = {name:"nssh",comment:"nice",rating:Number(2)};
        let result = await request(server).post(`/api/products/${product._id}/reviews`).send(review).set("authorization",`Bearer ${token}`);
        expect(result.body.review).toMatchObject(review)
    })
});
