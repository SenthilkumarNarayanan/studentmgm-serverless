const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const BaseURL=process.env.MONGO_URL;

const connectDB = async ()=> {
    try {
       await mongoose.connect(BaseURL);
       console.log("MongoDB connected");
       
    
    } catch (error) {
        console.error(error.message);
        process.exit(1);
        
    }

};
module.exports = connectDB;
