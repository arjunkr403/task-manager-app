import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type:String
    },
    board: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board"  // Reference to the Board model
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


export default mongoose.model("Task", taskSchema);