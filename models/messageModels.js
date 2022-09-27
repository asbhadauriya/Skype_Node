import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    message: {  
    type:  String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type:{
      type: String,
      default: "message"
    }
  }, 
  {
    timestamps: true,
  }
);

const Messages= mongoose.model("Messages", MessageSchema);

export default Messages;     