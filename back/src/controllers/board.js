import Board from '../models/Board.js';
import { errorHandler } from '../middleware/error.js';

export async function createBoard(req, res, next) {
    try {
        const { title } = req.body;
        if (!title) {
            return next(errorHandler(400, "No title"));
        }
        const board = await Board.create({ title, owner: req.user.id });
        res.status(201).json(board);

    } catch (error) {
        next(errorHandler(500, "Internal Server error"));
    }
}

export async function updateBoard(req,res,next){
    try {
        const {title}=req.body;
        if(!title) return next(errorHandler(404,"Title not found"));
        const board = await Board.findOneAndUpdate(
            {_id:req.params.id,owner: req.user.id}, //filter
            {title:title}, //update
            {new:true} //return updated data
        )
        if(!board) return next(errorHandler(404,"Not found to update"));
        res.json(board);
    } catch (error) {
        next(errorHandler(500,"Internal Server Error"));
    }
}

export async function deleteBoard(req,res,next) {
    try {
        const board=await Board.findOneAndDelete(
            {_id:req.params.id, owner:req.user.id}
        )
        if(!board) return next(errorHandler(404,"Not found to delete"));
        res.json({message:"Board deleted"});
    } catch (error) {
        next(errorHandler(500, "internal server error"));
    }
}
export async function getBoard(req,res,next) {
    try {
        const board= await Board.findOne({
            _id:req.params.id,owner:req.user.id
        })
        if(!board) return next(errorHandler(404,"Not found to get"));
        res.json(board);
        
    } catch (error) {
        next(errorHandler(500, "internal server error"));
    }
}
export async function getBoards(req,res,next) {
    try {
        const boards=await Board.find({
            owner:req.user.id
        })
        if(!boards) return next(errorHandler(404,"Not found to get all"));
        res.json(boards);
    } catch (error) {
        next(errorHandler(500, "internal server error"));
    }
}