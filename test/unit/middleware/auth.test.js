const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth');
describe('auth test', () => {
    it('should populate req.user with the payload of a valid jwt', () => {
        let obj = {_id:new mongoose.Types.ObjectId,isAdmin:true};
        let user = new User(obj);
        let token = user.generateToken();
    
        let res;
        let req ={
            headers:{
                authorization:`Bearer ${token}`
            }
        }
        let next = jest.fn();
        let result = auth(req,res,next);
        expect(req.user).toMatchObject(obj)
    });
    
});
