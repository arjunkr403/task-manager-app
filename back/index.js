import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { authVerify } from './src/middleware/jwtauth';
import cors from 'cors';
import authRoute from './src/routes/auth';
import boardRoute from './src/routes/board';
import taskRoute from './src/routes/task';


dotenv.config();
const app= express();
app.use(cors());
app.use(express.json());
const mongo_url= process.env.MONGO_URL;

const mongoConnect = async ()=>{
    try {
        await mongoose.connect(mongo_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
mongoConnect();

app.use("/back/auth",authRoute);
app.use("/back/board",boardRoute);
app.use("/back/task",taskRoute);

app.listen(5000,()=>{
    console.log("backend working on port 5000");
})
