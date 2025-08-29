import express from 'express';
import dotenv from 'dotenv';
if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: '../.env.dev' });
}
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './src/routes/auth.js';
import boardRoute from './src/routes/board.js';
import taskRoute from './src/routes/task.js';
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
// allow credentials and dynamic origin for local development
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// simple logger to show incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} -> ${req.method} ${req.originalUrl}`);
    next();
});
const mongo_url = process.env.MONGO_URL;

const mongoConnect = async (retries = 5, delay = 3000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(mongo_url);
            console.log("MongoDB connected successfully");
            return;
        } catch (error) {
            console.error(`MongoDB connection attempt ${i + 1} failed:`, error.message || error);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay}ms ...`);
                await new Promise((r) => setTimeout(r, delay));
            }
        }
    }
    console.error("MongoDB connection failed after retries.");
}
mongoConnect();

app.use("/back", authRoute);
app.use("/back", boardRoute);
app.use("/back", taskRoute);
app.get('/test', (req, res) => res.send('Test route working'));

// 404 handler so client sees unmatched routes
app.use((req, res) => {
    res.status(404).send(`Cannot ${req.method} ${req.originalUrl}`);
});

app.listen(5000, () => {
    console.log("backend working on port 5000");
})
