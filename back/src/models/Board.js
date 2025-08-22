import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the User model
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Board", boardSchema);