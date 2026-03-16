import mongoose from 'mongoose';

export const connectDB = async() => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/notesapp");
        console.log("MongoDB Connected");
    }
    catch (error){
        console.error("Database Connection Failed : ", error.message);
        process.exit(1);
    }
};