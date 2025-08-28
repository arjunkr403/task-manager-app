import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board" 
    },
    status: {
        type: String,
        enum: ["todo", "inProgress", "done"],
        default: "todo"
    }

}, { timestamps: true });


export default mongoose.model("Task", taskSchema);