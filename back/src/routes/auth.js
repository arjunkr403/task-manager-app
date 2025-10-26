import express from 'express';
import { signup, signin, signout } from '../controllers/auth.js';
import { authLimiter } from '../middleware/ratelimiter.js';

const router=express.Router();


router.post('/signup',authLimiter,signup);
router.post('/signin',authLimiter,signin);
router.get('/signout',signout);




export default router;