const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

// task creation endpoints
router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {
        await task.save();
        res.status(201).send(task);
    }
    catch (error) {
        res.status(400).send(error);
    }

    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });
});

// tasks reading endpoint
router.get('/tasks', auth, async (req, res) => {

    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        // const tasks = await Task.find({});
        // const tasks = await Task.find({ owner: req.user._id });
        await req.user.populate({
            path: 'tasks',
            // match: {
            //     completed: true
            // }
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                // sort: {
                //     createdAt: 1
                // }
                sort
            }
        });
        res.status(200).send(req.user.tasks);
    } catch (error) {
        res.status(500).send(error);
    }

    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
});

// tasks reading endpoint by Id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        // const tasks = await Task.findById(_id);
        const tasks = await Task.findOne({ _id, owner: req.user._id });
        if (!tasks) {
            return res.status(404).send();
        }
        return res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }

    // Task.findById(_id).then((tasks) => {
    //     if (!tasks) {
    //         return res.status(404).send();
    //     }

    //     return res.status(200).send(tasks);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
});

// task updation endpoint
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperations) {
        return res.status(400).send({ message: "Invalid Updates" });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // implement task update with findById
        // const task = await Task.findById({ _id: req.params.id });
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => {
            task[update] = req.body[update];
        });

        await task.save();
        res.status(200).send(task);
    } catch (error) {
        return res.status(400).send();
    }
});

// task deletion endpoint
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndRemove(req.params.id);
        const task = await Task.findOneAndRemove({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send({ 'message': 'Task not found' });
        }
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;