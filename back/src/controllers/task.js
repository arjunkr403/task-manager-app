import Task from "../models/Task.js";
import { errorHandler } from "../middleware/error.js";
import Board from "../models/Board.js";

export async function createTask(req, res, next) {
    try {
        const { title, description, completed } = req.body;
        if (!title) return next(errorHandler(400, "required"));
        const board = await Board.findOne({
            _id: req.params.boardId,
            owner: req.user.id
        })
        if (!board) return next(errorHandler(404, "Board not found or Unauthorized"));
        const task = await Task.create({
            title, description, completed,
            board: req.params.boardId,
        })
        res.status(201).json({ success: true, task });

    } catch (error) {
        next(errorHandler(500, "Internal Server Error"))
    }
}
export async function getTasks(req, res, next) {
    try {
        const board = await Board.findOne({
            _id: req.params.boardId,
            owner: req.user.id
        })
        if (!board) return next(errorHandler(404, "Board not found or Unauthorized"));
        const tasks = await Task.find({
            board: req.params.boardId
        })
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"));
    }
}
export async function getTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id).populate("board");
        if (!task) return next(errorHandler(404, "Task not found"));
        if (task.board.owner.toString() !== req.user.id)
            return next(errorHandler(403, "Unauthorized to access"));
        res.status(200).json({ success: true, task });
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"))
    }
}
export async function updateTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id).populate("board");
        if (!task) return next(errorHandler(404, "Task not found"));
        if (task.board.owner.toString() !== req.user.id)
            return next(errorHandler(403, "Unauthorized to update"));

        const { title, description, completed } = req.body;
        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.completed = completed ?? task.completed;

        await task.save();
        res.status(200).json({ success: true }, task);
    }
    catch (error) {
        next(errorHandler(500, "Internal Server Error"))
    }
} 
export async function deleteTask(req, res, next) {
    try {
        const task = await Task.findById(req.params.id).populate("board");
        if (!task) return next(errorHandler(404, "Task not found"));

        if (task.board.owner.toString() !== req.user.id) {
            return next(errorHandler(403, "Unauthorized to delete"));
        }
        await task.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        next(errorHandler(500, "Internal Server Error"))
    }
} 
