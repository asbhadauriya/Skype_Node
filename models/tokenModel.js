
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    token_id: {
        type: String
    },
    user_id: {
        type: String,
       
    },
  
});

const Token = mongoose.model('token', tokenSchema)

export default Token;