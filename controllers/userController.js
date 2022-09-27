import User from "../models/userModel.js";
import Validator from "validatorjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import reply from '../common/reply.js';
import Token from '../models/tokenModel.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import Messages from "../models/messageModels.js";
import { log } from "console";




function makeid() {
    return crypto.randomBytes(20).toString('hex');
}
function randomNum() {
    return Math.floor(1000 + Math.random() * 9000)
}


// mailsender details

//  var transporter = nodemailer.createTransport({

//     service : "gmail",
//     auth:{
//         user:"onedeal27@yopmail.com",
//         pass: "password"
//     },
//     tls:{
//         rejectUnauthorized : false
//     }
// })


export default {


    // user registration:

    async userRegister(req, res) {

        let request = req.body;

        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"));
        }

        let validation = new Validator(request, {
            firstname: 'required|string',
            lastname: 'required|string',
            password: 'required|min:8',
            phone: 'required_without:email|numeric|digits:10',
            email: 'required_without:phone|email',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }
        let exist = await User.findOne({ email: request.email });

        // console.log(exist);
        if (exist) {
            return res.json(reply.failed('This email is already exists!'));
        }


        try {

            //    const{ firstname, lastname,phone, email, password, d_o_b, gender } = req.body
            //     const userx = new User({
            //         firstname,
            //         lastname, 
            //         phone,
            //         email,
            //         password,
            //         d_o_b,
            //         gender,
            //         emailToken:  crypto.randomBytes(30).toString('hex'),
            //         isVerified: false

            //     })

            request.password = bcrypt.hashSync(request.password);
            //const user = await userx.save();

            const user = await User.create(request)
            return res.json(reply.success("User Created Successfully!!", user));

            // console.log("yeeeee");


            // send verification mail to user

            //     var mailOptions = {
            //         from: ' "verify Your email" <onedeal27@gmail.com>',
            //         to: userx.email,
            //         subject: `onedeal27 -verify your email`,
            //          html: `<h2> $(userx.name)! Thanks for  registering on our site </h2>
            //                   <h4> Please verify your mail to continue...</h4>
            //                   <a href = "http://$(req.headers.host)/userx/verify-email?token=$(userx.emailToken)">verify your Email</a>`
            //            }

            //     //sending email
            //         transporter.sendMail(mailOptions, function(error, info){
            //             if(error){
            //                 console.log(error)
            //             }
            //             else{
            //                 console.log("Verification email is sent to your gmail account")
            //             }
            //         })



        } catch (err) {

            res.json(reply.failed("Something Went Wrong!"))
            console.log("err", err)
        }
    },

    // verify email api:

    async verifyEmail(req, res) {
        try {
            const token = req.query.token
            const user = await User.findOne({ emailToken: token })
            if (user) {
                user.emailToken = null
                user.isVerified = true
                await user.save()
            }

        } catch (err) {
            res.json(reply.failed("email is not verified"));
        }

    },
    // async checkPassword(req,res){
    //     let id=req.user.user_id

    // },


    async passwordCheck(req,res){

        let request = req.body;
        console.log(request,"password check");
   try{

        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"));
        }

        let validation = new Validator(request, {

            password: 'required|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/|min:8',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }

        let exist = await User.findById({ _id: req.user._id});
        console.log(exist);
        
        if (!exist) {
            return res.json(reply.failed("User not found!!"))
        }

        const passwordIsvalid = bcrypt.compareSync(request.password, exist.password);
        //console.log(passwordIsvalid);
 
        return res.json(reply.success("password is correct!"))

    }catch(err) {
        return res.json(reply.failed("Password Incorrect!"));
         //console.log(err);
     }
       
    },
    // user login:

    async userLogin(req, res) {
        let request = req.body;
        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"))
        }

        let validation = new Validator(request, {
            email: 'required_without:phone|email',
            phone: 'required_without:email',
            password: 'required',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));
        }


        const user = await User.findOne({ email: request.email });
        // console.log(user);
        // const user = await User.findOne({ 
        //     $or: [
        //         { 'email': request.email },
        //         { 'phone': request.phone }
        //     ]
        //    });

        if (!user) {

            return res.json(reply.failed("User not found!!"))
        }


        const passwordIsvalid = bcrypt.compareSync(request.password, user.password);
        console.log(passwordIsvalid);

        if (!passwordIsvalid) {
            return res.json(reply.failed("Password Incorrect!"));
        }

        var token_id = makeid();

        let token = jwt.sign({ "user_id": user._id, "tid": token_id }, 'thisismyprivatekeyforUsertoverify', { expiresIn: "24h" });

        await Token.create({ token_id, user_id: user._id });

        return res.json(reply.success("User Login Successfully!!", { user, token: token }))
    },

    // User Logout:

    async logout(req, res) {

        try {
            console.log("heyyy");

            let _id = req.user._id
            const userx = await Token.deleteMany({ user_id: _id })
            console.log(userx, "heyyy");
            return res.json(reply.success("User Logged Out Successfully!!"))

        } catch (err) {

            return res.json(reply.failed("Unable to logout!"))
            console.log(err, "error");
        }
    },

    //Get All Users:

    async getAllUser(req, res) {
        try {

            const users = await User.find({

                //     '$or':[
                //     {"firstname":{$regex:req.query.key, $options: 'i'}},
                //     {"lastname":{$regex:req.query.key, $options: 'i'}},
                //     {"phone":{$regex:req.query.key}}
                // ]
            }).select(["email",
                "firstname", "lastname", "image"]);


            return res.json(reply.success("Fetch data successfully!!", users));
        } catch (err) {

            res.json(reply.failed("Unable to fetch data!"));
            console.log(err);
        }
    },

    // async getMessages=()=>{

    // }

    async fetchHistoryMessage(req,res){
        let sender=req.user._id
        let {reciever}=req.params
        let page=req.query.page
        console.log(page);
        console.log(sender,reciever);

        try {
            // // Adding Pagination
            // const limitValue = req.query.limit || 2;
            // const skipValue = req.query.skip || 0;
            const posts = await Messages.find({
                "sender": { $in: [sender, reciever] },
                "reciever": { $in: [reciever, sender] }
            }).limit(10).skip(10*page).sort({$natural:-1})
            posts.reverse()
                
            res.status(200).send(posts);
        } catch (e) {
            console.log(e);
        }

    },
    async getAllUsers(req, res) {
        let sender = req.user._id
        try {

            let users = await User.find({
                "_id": { $ne: sender }

                //     '$or':[
                //     {"firstname":{$regex:req.query.key, $options: 'i'}},
                //     {"lastname":{$regex:req.query.key, $options: 'i'}},
                //     {"phone":{$regex:req.query.key}}
                // ]
            }).select(["_id", "email",
                "firstname", "lastname", "image"]);
            console.log(sender);

            users = users.map(async (p) => {
                const message = await Messages.find({
                    "sender": { $in: [sender, p._id] },
                    "reciever": { $in: [p._id, sender] }
                }).limit(10).sort({$natural:-1})

                message.reverse()



                p._doc['chat']=message
                p._doc['count']=0

               

                // let n_p = {};
                // n_p = Object.assign(n_p , p);
                // n_p = Object.assign({ chat: message, count: 0 } , n_p);
                
                return p;
            });
            

            // let result = await  Promise.all(users);
            users = await  Promise.all(users);

            return res.json(reply.success("Fetch data successfully!!", users));
        } catch (err) {

            res.json(reply.failed("Unable to fetch data!"));
            console.log(err);
        }
    },
    // Get User by id:

    async getUserByIds(req, res) {
        try {
            let id = req.query.id
            const user = await User.findById(id).select("-password")

            return res.json(reply.success("User By Id", user))

        } catch (err) {
            return res.json(reply.failed("No Data Found"))
        }
    },

    // Update a User:

    async updateUsers(req, res) {
        let request = req.body
        try {
            let data = req.file
            request.image = data?.filename;
            console.log(request.image);
            if (!request) {
                return res.json(message.failed("All input is required"));
            }

            // let validation = new Validator(request, {

            //     firstname: 'required',
            //     lastname: 'required',
            //     email: 'required',
            //     phone: 'required',
            //     image: 'required'
            // });

            // if (validation.fails()) {

            //     let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0]
            //     return res.json(reply.failed(validation.errors.first(err_key)))
            // }

            let _id = req.query.id
            const user = await User.findById(_id);
            console.log(user);
            if (!user) {
                return res.json(reply.failed("User not found!!"))
            }
            const userx = await User.findByIdAndUpdate(_id, request)

            return res.json(reply.success("User Updated Successfully", request))

        } catch (err) {
            return res.json(reply.failed("Unable to Update"))

        }


    },

    // Delete a User:

    async deleteUsers(req, res) {

        let id = req.query.id
        const user = await User.findByIdAndRemove(id)
        if (user) {
            return res.json(reply.success("User Deleted Successfully", user))
        } else {
            return res.json(reply.failed("Unable to delete"))
        }
    },

    // email checking

    async emailChecking(req, res) {

        let request = req.body;
        // let email=
        // email=email.toLowercase()

        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"));
        }

        let validation = new Validator(request, {

            email: 'required|email',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }


        let exist = await User.findOne({ email: request.email });

        console.log(exist);
        if (exist) {
            return res.json(reply.failed('This email is already exists!'));
        }
        else {
            return res.json(reply.success("You can proceed forward"))
        }
    },

    //search user

    async searchUser(req, res) {

        try {

            const users = await User.find({
                '$or': [
                    { "firstname": { $regex: req.query.key, $options: 'i' } },
                    { "lastname": { $regex: req.query.key, $options: 'i' } },
                    { "phone": { $regex: req.query.key } }
                ]
            });

            return res.json(reply.success("Fetch data successfully!!", users));
        } catch (err) {

            res.json(reply.failed("Unable to fetch data!"));

        }
    },

    //api for otp

    async otpCreate(req, res) {

        let request = req.body;


        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"))
        }
        let validation = new Validator(request, {

            email: 'required|email',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }
        var otp = randomNum();

        let exist = await User.findOne({ email: request.email });
        if (!exist) {

            return res.json(reply.success("otp generated successfully", otp))

        }

        else {
            return res.json(reply.failed("failed to send otp"))
        }
    },


    // OTP CREATION FOR CHANGE PASSWORD

    async againOtp(req, res) {


        let request = req.body;


        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"))
        }
        let validation = new Validator(request, {

            email: 'required|email',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }
        var otp = randomNum();

        let exist = await User.findOne({ email: request.email });
        if (!exist) {

            return res.json(reply.failed("User Not Found"))

        }

        return res.json(reply.success("otp generated successfully", otp))

    },

    //change password

    async changePassword(req, res) {
        console.log("change password");
        let request = req.body
        try {

            const userId = req.query.id

            const user = await User.findById(userId);
            console.log(user);
            if (!user) {
                return res.json(reply.failed("User not found!!"))
            }

            const passwordIsvalid = bcrypt.compareSync(request.password, user.password);
            //console.log(passwordIsvalid);

            if (!passwordIsvalid) {
                return res.json(reply.failed("Password Incorrect!"));
            }

            if (request.password == request.newPassword) {
                return res.json(reply.failed("old password and new password both are same"))
            }

            request.newPassword = bcrypt.hashSync(request.newPassword)
            const userPassword = await User.findByIdAndUpdate({ _id: userId }, { password: request.newPassword }, { new: true });
            return res.json(reply.success("password changed successfully", { status: true, data: userPassword }));

        } catch (err) {
            return res.json(reply.failed("failed to change password"));
            //console.log(err);
        }
    },

    //PHONE CHECKING

    async phoneChecking(req, res) {

        let request = req.body;

        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"));
        }

        let validation = new Validator(request, {

            phone: 'required|numeric|digits:10',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }


        let exist = await User.findOne({ phone: request.phone });
        //console.log(exist);

        if (exist) {
            return res.json(reply.failed('This number is already exists!'));
        }
        else {
            return res.json(reply.success("You can proceed forward"))

        }
    },

    // OTP FOR PHONE
    async phoneOtp(req, res) {

        let request = req.body;


        if (Object.keys(request).length == 0) {
            return res.json(reply.failed("All input is required!"))
        }
        let validation = new Validator(request, {

            phone: 'required|numeric|digits:10',

        });

        if (validation.fails()) {
            let err_key = Object.keys(Object.entries(validation.errors)[0][1])[0];
            return res.json(reply.failed(validation.errors.first(err_key)));

        }
        var otp = randomNum();

        let exist = await User.findOne({ phone: request.phone });
        if (!exist) {

            return res.json(reply.success("otp generated successfully", otp))

        }

        else {
            return res.json(reply.failed("failed to send otp"))
        }

    }

}




