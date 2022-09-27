
import mongoose from 'mongoose';

const conf = () => {


    mongoose.connect(process.env.MONGO_URI, {

        useNewUrlParser: true,
       
        useUnifiedTopology:true,
    }).then(()=>console.log('info','mongo is connected')).catch((err)=>console.log(err));



    // mongoose.connect('mongodb://localhost/chatskype');
    // const db= mongoose.connection;
    // db.on('error',console.error.bind('Unable to connect to the database'));
    // db.once("open",function calback(){
    //     console.log("Connection has been established successfully!!");
     
    // })
}

export default conf;