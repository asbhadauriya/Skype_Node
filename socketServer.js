
import reply from './common/reply.js'
import messageController from './controllers/messageController.js';
import Messages from "./models/messageModels.js"
import User from './models/userModel.js';


let user = [];

const addUser = (userId, socketId) => {
    console.log("heyyyyyyy")
    // if(!userId||!socketId){
    //     return res.json(reply.failed("userId and socketId required"))
    // }
    !user.some((user) => user.userId === userId) &&
        user.push({ userId, socketId });
    console.log(user, "socket", socketId)

}

const removeUser = (socketId) => {
    user = user.filter((user) => user.socketId !== socketId);
}

const getUser = (userId) => {
    //console.log("tum",user);
    let l = user.find((u) => {
        //console.log(userId,"test1",u.userId.userId);
        if (u.userId.userId === userId) {
            return u.userId
        }
    })
    // console.log(l);
    return l

}

const SocketServer = (socket) => {
   
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id);

        socket.emit("getUsers", user)

    });
    

    socket?.on("typing", ({ senderId, recieverId }) => {
        console.log("sender is typing", recieverId);

        const user = getUser(recieverId);
        //console.log("send to use",user);
        socket?.to(user?.socketId).emit("getTyping", {
            senderId,
        }, console.log("chat okay"))
    })

    // send and get messages

    socket.on("sendMessage", ({  reciever, message,type }) => {
      console.log("hmmm");
        console.log("reciever",reciever,"message",message,"type",type);

       console.log(socket.decoded);
       let sender=socket.decoded.user_id

        const is_reciever = async function getF() {
            return await User.findById(reciever);

        }
        

if(type=="message"){
    console.log("jgh");
    messageController.addMessage({ sender, reciever, message,type });
}
else if(type=="image"||type=="video"||type=="file"){
  
    messageController.addMessage({sender,reciever,message,type})
}
// console.log(socket);
       

        const user = getUser(reciever); 
        console.log("user==",user);
        
        if (is_reciever != undefined) {
            console.log(user);
            if(type=="image"||type=='video')
            {
                message = process.env.API_HOST+ message;
            }

            socket?.to(user?.socketId).emit("getMessage", { sender, reciever, message,type },console.log("get message Works",message));

        }

    });
    socket.on('ping',({sender,reciever})=>{
        // console.log("check user is online",sender);
    //     const user = getUser(reciever);
    const p = getUser(sender);
        
    //     if (user != undefined) {
    //         console.log("true");


        user.map((p)=>{
            // console.log(p.userId.userId);
            if(p.userId.userId!=sender){
                // console.log(p.socketId);
                socket?.to(p?.socketId).emit('pong',
                sender
          
            
            )

            }
          

        })
        
    // }

    })



// user disconnected
socket.on('disconnect', () => {

    console.log("User disconnected" + socket.id)
    removeUser(socket.id);
    socket.emit("getUsers", user)
})

}

export default SocketServer;