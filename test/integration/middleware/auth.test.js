let request = require("supertest");
let server;
let mongoose = require('mongoose');
let {User} = require('../../../models/user');
describe('auth test integration', () => {
    let token;
    let userObj ={_id:new mongoose.Types.ObjectId,email:"test@gmail.com",password:"akk12345",name:"test"};
    beforeEach(()=>{
        server=require('../../../index');
    });
    afterEach(async()=>{
       await server.close();
       await User.remove();
    });
    beforeEach(async()=>{
        let user=new User(userObj);
        await user.save();
        token = user.generateToken();
    })
    it("should return status 200 if has user token",async()=>{
        let result =  await request(server).get(`/api/users/${userObj._id}`).set("authorization",`Bearer ${token}`);
        expect(result.status).toBe(200);
    })
    it("should return status 403 if user is not admin",async()=>{
        let result = await request(server).delete(`/api/users/${userObj._id}`).set("authorization",`Bearer ${token}`);
        expect(result.status).toBe(403);
    })
});
