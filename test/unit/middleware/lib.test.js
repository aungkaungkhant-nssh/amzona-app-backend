const {applyDiscount} = require('../../../lib');
let db= require('../../../libdata');
describe('absolute', () => {
    it("apply discount",()=>{
        db.getCustomerSync=function(id){
            console.log("Customer fake")
            return {id,point:11};
        }
  
        let result = applyDiscount(1);
        expect(result).toBe(9)
    })
});
