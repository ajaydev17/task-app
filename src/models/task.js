// import mongoose module
const mongoose = require('mongoose');

// defination of task schema
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// create a task modal
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;