import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoute from './src/routes/auth.js';
import boardRoute from './src/routes/board.js';
import taskRoute from './src/routes/task.js';
import cookieParser from "cookie-parser";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: '../.env.dev' });
}
const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
const mongo_url = process.env.MONGO_URL;

const mongoConnect = async () => {
    try {
        await mongoose.connect(mongo_url);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
    }
}
mongoConnect();

app.use("/back/auth", authRoute);
app.use("/back/board", boardRoute);
app.use("/back/task", taskRoute);
app.get('/test', (req, res) => res.send('Test route working'));
app.listen(5000, () => {
    console.log("backend working on port 5000");
})
