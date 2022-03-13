require('express-async-errors');
require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./startup/logger');
const { Server } = require("socket.io");

require('./startup/routes')(app)
require('./startup/logging')();
require('./startup/db')(logger);



let port = process.env.PORT || 4000;

let server = app.listen(port,function(){
   logger.log({level:"info",message:`Server is running on port ${port}`})
});

let users=[];
const io =new Server(server,{ cors: { origin: '*' } });
io.on("connection",(socket)=>{
   socket.on("disconnect",()=>{
      console.log("hi")
   })
   socket.on("onLogout",(data)=>{
      const admin = users.find((x)=>x.isAdmin && x.online);
      if(admin){
          let updateUser=  users.find((x)=>x._id===data._id);
          if(updateUser){
             updateUser.online=false;
             updateUser.socketId=socket.id;
            console.log(users);
            io.to(admin.socketId).emit("listUsers",users);
            io.to(admin.socketId).emit("updateUser",updateUser);
            
          }
      }
   })
   socket.on("onLogin",(user)=>{
      let updateUser={
         ...user,
         online:true,
         socketId:socket.id,
         messages:[]
      }
      let existUser = users.find((x)=>x._id === updateUser._id);
     
      if(existUser){
         existUser.online=true;
         existUser.socketId=socket.id
      }else{
         users.push(updateUser);
      }
      const admin = users.find((x)=>x.isAdmin && x.online);
      if(updateUser.isAdmin){
      
         io.to(admin.socketId).emit("listUsers",users);
      }
      if(admin){
         io.to(admin.socketId).emit("updateUser",updateUser)
      }
      
   });
   socket.on("onMessage",(message)=>{
      if(message.isAdmin){
         const user = users.find((x)=>x._id===message._id && x.online);
         if(user){
            io.to(user.socketId).emit("message",message);
            user.messages.push(message);
         }
      }else{
         const admin = users.find((x)=>x.isAdmin && x.online);
         if(admin){
            io.to(admin.socketId).emit("message",message);
            let existUser = users.find((x)=>(x._id === message._id));
            existUser.messages.push(message);
         }else{
            io.to(socket.id).emit("message",{
               name:"Admin",
               body:"Sorry,Admin is not online right now!"
            })
         }
      }
      
   })
   socket.on("onSelectedUser",(user)=>{
      let admin = users.find((x)=>x.isAdmin && x.online);
      if(admin){
         let existUser = users.find((x)=>x._id === user._id);
         io.to(admin.socketId).emit("selectedUser",existUser);
      }
   })
   socket.on("onUnReadMessage",(user)=>{
      let admin = users.find((x)=>x.isAdmin && x.online);
      if(admin){
        users=  users.map((x)=>(x._id===user._id ? {...x,unread:true} : x));
        io.to(admin.socketId).emit("listUsers",users);
      }
   })
   socket.on("onReadMessage",(user)=>{
      let admin = users.find((x)=>x.isAdmin && x.online);
      if(admin){
        users=  users.map((x)=>(x._id===user._id ? {...x,unread:false} : x));
        io.to(admin.socketId).emit("listUsers",users);
      }
   })
})

module.exports = server;