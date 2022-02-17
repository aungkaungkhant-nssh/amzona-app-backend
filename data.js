const data = {
    users:[
        {
            name:"user",
            email:"user@gmail.com",
            password:"user123",
            isAdmin:false
        },
        {
            name:"admin",
            email:"admin@gmail.com",
            password:"admin123",
            isAdmin:true
        }
    ],
    products:[
        {
            _id:1,
            name:"Nike Slim Shirt",
            categroy:"Shirt",
            brand:"Nike",
            price:12,
            description:"high quality product",
            rating:2.5,
            numReviews:10,
            image:'/images/p1.jpg',
            numberInstock:20
        },
        {
            _id:2,
            name:"Adidas Free Shirt",
            categroy:"Shirt",
            brand:"Adidas",
            price:20,
            description:"high quality product",
            rating:1.5,
            numReviews:10,
            image:'/images/p2.jpg',
            numberInstock:20
        },
        {
            _id:3,
            name:"Puma Fit Shirt",
            categroy:"Shirt",
            brand:"Puma",
            price:30,
            description:"high quality product",
            rating:3,
            numReviews:10,
            image:'/images/p3.jpg',
            numberInstock:13
        },
        {
            _id:4,
            name:"Nike Slim Pant",
            categroy:"Pant",
            brand:"Nike",
            price:27,
            description:"high quality product",
            rating:4.5,
            numReviews:10,
            image:'/images/p6.jpg',
            numberInstock:2
        },
        {
            _id:5,
            name:"Adidas Fit Pant",
            categroy:"Pant",
            brand:"Adidas",
            price:28,
            description:"high quality product",
            rating:4.5,
            numReviews:10,
            image:'/images/p5.jpg',
            numberInstock:0
        },
        {
            _id:6,
            name:"Puma Free Pant",
            categroy:"Pant",
            brand:"Puma",
            price:37,
            description:"high quality product",
            rating:4.5,
            numReviews:10,
            image:'/images/p4.jpg',
            numberInstock:3
        },
    ]
}

module.exports=data;