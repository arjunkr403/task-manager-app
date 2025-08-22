import express from 'express';
import { createTask, getTasks, getTask, updateTask, deleteTask } from '../controllers/task.js';
import { authVerify } from '../middleware/jwtauth.js';
const router =express.Router();

router.post('/:boardId/tasks',authVerify,createTask);
router.get('/:boardId/tasks',authVerify,getTasks);
router.get('/tasks/:id',authVerify,getTask);
router.put('/tasks/:id',authVerify,updateTask);
router.delete('/tasks/:id',authVerify,deleteTask);
export default router;