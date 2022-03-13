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
           
            name:"Nike Slim Shirt",
            category:"Shirt",
            brand:"Nike",
            price:12,
            description:"high quality product",
            rating:2.5,
            numReviews:10,
            image:'/images/p1.jpg',
            numberInstock:20,
         
        },
        {
          
            name:"Adidas Free Shirt",
           category:"Shirt",
            brand:"Adidas",
            price:20,
            description:"high quality product",
            rating:1.5,
            numReviews:10,
            image:'/images/p2.jpg',
            numberInstock:20
        },
        {
         
            name:"Puma Fit Shirt",
           category:"Shirt",
            brand:"Puma",
            price:30,
            description:"high quality product",
            rating:3,
            numReviews:10,
            image:'/images/p3.jpg',
            numberInstock:13
        },
        {
            
            name:"Nike Slim Pant",
           category:"Pant",
            brand:"Nike",
            price:27,
            description:"high quality product",
            rating:4.5,
            numReviews:10,
            image:'/images/p6.jpg',
            numberInstock:2
        },
        {
           
            name:"Adidas Fit Pant",
           category:"Pant",
            brand:"Adidas",
            price:28,
            description:"high quality product",
            rating:4.5,
            numReviews:10,
            image:'/images/p5.jpg',
            numberInstock:0
        },
        {
           
            name:"Puma Free Pant",
            category:"Pant",
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