import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();  // Ensure this is at the top

// connect to mongoose db

const connectDB = async () => {
    try {
        await connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDB