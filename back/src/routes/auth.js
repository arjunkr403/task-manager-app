import express from 'express';
import { signup, login, signout } from '../controllers/auth.js';
const router=express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('signout',signout);




export default router;