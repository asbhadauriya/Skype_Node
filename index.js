
import express from 'express';
import jwt from 'jsonwebtoken';
import http from 'http';
import conf from './database/database.js'
import Router from './routes/api.js'
import 'dotenv/config'
import cors from "./config/cors.js";
import { fileURLToPath } from 'url';
const app = express();
import {Server}  from 'socket.io';
const server = http.createServer(app);
// const io = new Server(server);
import path from 'path';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
app.use(cors)
import SocketServer from './socketServer.js';
import { log } from 'console';

app.use(express.json())
conf();

app.get('/' , (req,res) => {
return res.json({status: 'Working'});
})

app.get("/uploads/:path", (req, res) => {
  res.sendFile(__dirname + '/uploads/' + req.params.path);
});


app.use(Router);
app.use(express.static('uploads'));



const io=new Server(server,{
    
      cors:{
            origin:"*",
            methods: ["GET", "POST"],       
     
      },
})

io.use((socket, next) => {
    var msg = { auth: false, message: 'Unauthenticated' };
    const token = socket.handshake.auth.token;
//     console.log(token);
    if (token) {
   
      jwt.verify(token, 'thisismyprivatekeyforUsertoverify', (err, decoded) => {
        if (err) {
            return res.status(401).send(msg);
            
        }
      //   console.log('user', user,"juyhkjuhu");
    // save the user data into socket object, to be used further
//     console.log("hello",socket);
//     socket.user = user;
        socket.decoded = decoded;

        next();
      });
    } else {
      return res.status(401).send(msg);
    }
  })// socket connection

  
  io.on('connection', (socket)=>{
      console.log("thiss run");

      console.log(socket.id);
     console.log('user is connected with :'+socket.id)
      SocketServer(socket)
})

server.listen(6800,console.log("Server listening on port 6800!"))

