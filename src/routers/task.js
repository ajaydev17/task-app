const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

// task creation endpoints
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

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
router.get('/tasks', async (req, res) => {

    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
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
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const tasks = await Task.findById(_id);
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

// user updation endpoint
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperations) {
        return res.status(400).send({ message: "Invalid Updates" });
    }

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // implement task update with findById
        const task = await Task.findById({ _id: req.params.id }, req.body, { new: true, runValidators: true });
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

// user deletion endpoint
router.delete('/tasks/:id', async (req, res) => {
    try {
        const user = await Task.findByIdAndRemove(req.params.id);
        if (!user) {
            return res.status(404).send({ 'message': 'Task not found' });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;