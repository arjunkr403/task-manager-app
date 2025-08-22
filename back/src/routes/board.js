import express from 'express';
import { createBoard, getBoards, getBoard, updateBoard, deleteBoard } from '../controllers/board.js';
import { authVerify } from '../middleware/jwtauth.js';
const router = express.Router();

router.post('/boards', authVerify,createBoard);
router.put('/boards/:id',authVerify, updateBoard);
router.delete('/boards/:id',authVerify, deleteBoard);
router.get('/boards/:id', authVerify, getBoard);
router.get('/boards',authVerify, getBoards);

export default router;
