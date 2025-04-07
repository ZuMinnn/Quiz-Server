import mongoose from "mongoose";
const { Schema } = mongoose;

/** question model */
const questionModel = new Schema({
    questions: {
        type: Array,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    audioUrl: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Questions', questionModel);