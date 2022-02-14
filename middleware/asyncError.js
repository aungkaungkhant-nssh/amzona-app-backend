module.exports = function (handler){
    return (req,res,next)=>{
        try{
            handler(req,res)
        }catch(err){
            next(err)
        }
    }
}