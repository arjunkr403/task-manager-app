import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorHandler } from '../middleware/error.js';

const jwtkey = process.env.JWT_SECRET;

export const signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        //validate input
        if (!username || !email || !password) {
            return next(errorHandler(400, 'All fields are required'));
        }
        const existingUser = await User.findOne({
            $or: [{ username }, { email }] //check either username or email exists
        });
        if (existingUser) {
            return next(errorHandler(400, 'User already exists'));
        }
        const hashpassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashpassword
        });
        console.log(newUser);
        const token = jwt.sign({ id: newUser._id }, jwtkey);
        // const { password: pass, ...rest } = newUser._doc; //omit password from user data
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     sameSite: "none",
        //     maxAge: 24 * 60 * 60 * 1000 // 1 day
        // }).status(200).json(rest);
        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        next(error);
    }
}

export const signin = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return next(errorHandler(400, "Credentials Required"));
        }
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }]
        });
        if (!user) {
            return next(errorHandler(400, 'User not found'));
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return next(errorHandler, 'Invalid password');
        const token = jwt.sign({ id: user._id }, jwtkey);
        const { password: pass, ...rest } = newUser._doc; //omit password from user data
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        res.status(200).json("User has been logged out!");
    } catch (error) {
        next(error);
    }
} 