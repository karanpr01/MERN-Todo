import mongoose from "mongoose";

const connnectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected Successfully");
        
    } catch (error) {
        console.error(error.message);
        console.error(error);
        
    }
}

export default connnectDB