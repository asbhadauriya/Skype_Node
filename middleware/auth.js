
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Token from "../models/tokenModel.js";


var Authorization = function (req, res, next) {

    var token = req.headers.authorization;
    token = token?.split(' ')[1] || null;


    var msg = { auth: false, message: 'Unauthenticated' };

    if (!token) {
        return res.status(401).send(msg);
    };

    jwt.verify(token, 'thisismyprivatekeyforUsertoverify', async function (err, decoded) {

        if (err) {
            return res.status(401).send(msg);
        };

        const is_token = await Token.find({

            raw: true,
            token_id: decoded.tid

        });

        if (!is_token) {
            return res.status(401).send(msg);
        }

        let user_id = is_token.map((p) => {

            return p.user_id
        });

        const user = await User.findById(user_id);

        if (!user) {
            return res.status(401).send(msg);
        }

        req.user = user;
        console.log(req.user);
        req.token_id = decoded.tid;
        next();
    });
}


// const verifyEmail = async (req, res, next) => {
//     try {
//         const user = await User.findOne({ email: req.body.email })
//         if (user.isVerified) {
//             next()
//         }

//     } catch (err) {
//         res.json(success.failed("please check your email to verify your account"))
//     }

// }

export default Authorization