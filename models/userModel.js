
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstname: {
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    image: {
        type: String,    
        // get(image) {
            
        //     return `${process.env.API_HOST}/${image}`
        // },
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA1asRMWrlXo4OqYty4xgM5YmoZ6DjhWhEcw&usqp=CAU"
        
    },
    email: {      
        type: String,
        allowNull: false
        
    },
    phone: {
        type: String,
        default:null
      
    },
    password: {
      
        type: String
    
   }, 
   birthday: {
    type:String
   },
   
   country:{
    type:String
   },

   otp:{
    type:String
   },
   activity:{
    type:Boolean
   }
  
    


    // emailToken: {
    //     type: String
    // },
    // isVerified: {
    //     type: Boolean
    // },
    // date: {
    //     type: Date,
    //     default: Date.now()
    // },
},
 
{ timestamps: true, toJSON: { getters: true }, id: false }
)

const User = mongoose.model('users', userSchema)

export default User;