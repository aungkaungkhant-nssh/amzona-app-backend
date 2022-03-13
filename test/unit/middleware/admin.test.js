const mongoose= require('mongoose');
let auth = require('../../../middleware/auth');
const {User} = require('../../../models/user');
let admin = require('../../../middleware/admin');
describe('admin test', () => {
    it("should return req.user isAdmin",()=>{
        let user = {_id:new mongoose.Types.ObjectId,isAdmin:true};
        let token = new User(user).generateToken();
        let req ={
            headers:{
                authorization:`Bearer ${token}`
            }
        }
        let res;
        let next = jest.fn();

        auth(req,res,next);
        admin(req,res,next);
    })
});
