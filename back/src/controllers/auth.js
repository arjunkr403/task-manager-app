import bcrypt from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken';
import User from '../models/User';
import { errorHandler } from '../middleware/error';

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
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(201).json({
            message: "Account Created Successfully", token, user: {
                id: newUser._id,
                username: newUser.username
            },
        });

    } catch (error) {
        next(error);
    }
}

export const login = async(req, res, next)=>{
    try {
        const {identifier, password}=req.body;
        if(!identifier || !password){
            return next(errorHandler(400,"Credentials Required"));
        }
        const user= await User.findOne({
            $or : [{username:identifier},{email:identifier}]
        });
        if(!user){
            return next(errorHandler(400,'User not found'));
        }
    } catch (error) {
        next (error);
    }
}