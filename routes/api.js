
import express from "express";
import UserController from "../controllers/userController.js";
import MessageController from "../controllers/messageController.js";
import Authorization from "../middleware/auth.js";
import multer from 'multer';
import bodyParser from 'body-parser';
import messageController from "../controllers/messageController.js";



const Router = express.Router();
 Router.use(bodyParser.json());


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + '-' + file.originalname);
    }
 });
 var upload = multer({ storage: storage });
 

// ##### User-Router #####


Router.post("/userCreate",UserController.userRegister); //USER CREATE
Router.post("/userLogin",UserController.userLogin); //USER LOGIN
Router.delete('/logout',UserController.logout); //LOGOUT
Router.get("/AllUser",Authorization,UserController.getAllUsers);
Router.get("/historymessage/:reciever",Authorization,UserController.fetchHistoryMessage); //ALL USERS
Router.get("/userbyid",Authorization,UserController.getUserByIds); //USER BY ID
Router.put("/updateUser", upload.single('image'),UserController.updateUsers) //UPDATE USER
Router.delete("/userDelete",UserController.deleteUsers); // USER DELETE
Router.post("/emailChecking",UserController.emailChecking); //EMAIL CHECKING
Router.get("/searchUser",UserController.searchUser) //SEARCH USER
Router.post("/otp",UserController.otpCreate) // OTP CREATION
Router.put("/changePassword",UserController.changePassword) //CHANGE PASSWORD
Router.post("/againOtp",UserController.againOtp) //AGAIN OTP
Router.post("/phoneChecking",UserController.phoneChecking); //PHONE CHECKING
Router.post("/phoneOtp",UserController.phoneOtp); //PHONE OTP
Router.post('/profile-upload-single/:reciever', upload.single('profile-file'), messageController.uploadFile)
Router.post("/passwordChecking",Authorization,UserController.passwordCheck);


// ##### Message Router #####
 
Router.post("/addmsg",MessageController.addMessage); //ADD MESSAGE
Router.get("/getmsg/:reciever",Authorization,MessageController.getMessages); //GET MESSAGE
Router.get("/getallmsg",MessageController.allMessages);



export default Router;