
import Messages from "../models/messageModels.js";
import reply from "../common/reply.js";
// import { fileURLToPath } from 'url';
// import path from 'path';

const obj= {
  image:["jpg","png","jpeg","gif","tiff ","raw","ico","ps","psd","svg"],
  video:["mp4", "avi", "3gp","flv","mpeg"] 

}


export default {

  // Add Messages

  async addMessage({ sender, reciever, message,type }) {
    console.log(reciever,"reciever");



    try {
      if(type=="image"||type=='video'||type=="file")
      {
        var message = process.env.API_HOST+ message;
      }
      console.log(type,"khjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");

      const data = await Messages.create({ sender, reciever, message,type })

      console.log(data,"add 32");
      // return res.json(reply.success("Message added successfully!!", data));

    } catch (err) {
      console.log(err);
    }
  },

  

  // Get Messages

  async getMessages(req, res) {

    let reciever = req.params.reciever;
    let sender = req.user._id

    console.log({ sender:'6307cac7758ba979e5550b03' , reciever});

    try {



      const messages = await Messages.find(
     
        // {
        //   $or: [
        //     { sender: { $in: ['6307cac7758ba979e5550b03', reciever] } },
        //     { reciever: { $in: ['6307cac7758ba979e5550b03', reciever] } }
        //   ]
        // }

        {
          "sender": { $in: [sender, reciever] },
          "reciever": { $in: [sender, reciever] }
        },

      );



      return res.json(reply.success("All Messages", messages));
    } catch (err) {
      return res.json(reply.failed(err))
    }
  },

  //GET ALL MESSAGES

  async allMessages(req, res) {
    try {
      let exist = Messages.find({}).sort('-createdAt')
      return res.json(reply.success("all messages", exist))

    } catch (err) {
      res.json(reply.failed("Failed to get messages!"))
      console.log(err);

    }
  },
  async uploadFile (req, res) {
    const file = req.file;
    // let sender = req.user._id
    // let reciever = req.params.reciever

//     const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);
let type=""

    // console.log(__dirname);


    // let message=__filename
    console.log(file.mimetype,"ghjl");

let p=Object.keys(obj)
let mime=file.mimetype
let i=0
for( i=0;i<=p.length-1;i++)
{
    let a=p[i]
    let t=mime.split("/")
    console.log(obj[a].includes("jpeg")?1:2,"114 uploads",t[1]);

    
    if(obj[a].includes(t[1]))
{
    type=a;
    break;
}
}
if(type=="")
{
  type="file"
}

    // await Messages.create({ "sender":"630d9fc05443cbef78ec2d7c", "reciever":"630d9fc05443cbef78ec2d7c", message })
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    // console.log(JSON.stringify(req.file.filename))
    // var response = '<a href="/">Home</a><br>'
    // response += "Files uploaded successfully.<br>"
    // response += `<img src="${req.file.path}" /><br>`
 

    try {
      var message = file.path

      // const data = await Messages.create({ sender, reciever, message,type })
      return res.json({message,type})

      console.log(data);
      // return res.json(reply.success("Message added successfully!!", data));

    } catch (err) {
      console.log(err);
    }

   
    

   
  }



};