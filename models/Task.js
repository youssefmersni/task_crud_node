import { Schema, model } from 'mongoose';


const taskSchema = new Schema({
    title: String,
    description: String,
    done: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default model('Task', taskSchema);
