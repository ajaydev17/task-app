const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

// user creation endpoint
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (error) {
        res.status(400).send(error);
    }

    // user.save().then(() => {
    //     res.status(201).send(user);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });
});

// users reading endpoint with aunthetication
router.get('/users/me', auth, async (req, res) => {
    res.status(200).send(req.user);
    // get all the users with find query
    // try {
    //     const users = await User.find({});
    //     res.status(200).send(users);
    // }
    // catch (error) {
    //     res.status(500).send(error);
    // }

    // User.find({}).then((users) => {
    //     res.status(200).send(users);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
});

// users reading endpoint by Id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        return res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }

    // User.find({ _id: id }).then((user) => {
    //     if (!user) {
    //         return res.status(404).send();
    //     }

    //     return res.status(200).send(user);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });

    // can be implermented using findById query also
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send();
    //     }

    //     return res.status(200).send(user);
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
});

// user updation endpoint
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperations = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperations) {
        return res.status(400).send({ 'message': 'Invalid updates' });
    }

    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // implement findOneAndUpdate so that we can trigger a middleware
        //const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });

        // implement findById so that we can trigger save middleware
        // const user = await User.findById(req.params.id);

        // if (!user) {
        //     return res.status(404).send();
        // }

        // updating the logged in user
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });

        await req.user.save();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send();
    }
});

// user deletion endpoint
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndRemove(req.params.id);
        // if (!user) {
        //     return res.status(404).send({ 'message': 'User not found' });
        // }
        // deleting the user who is logged in
        await req.user.deleteOne();
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
});

// user login endpoint
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        user.loggedIn = true;
        await user.save();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send({ 'message': 'Error Occured during login!!' });
    }
});

// user logout endpoint
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        req.user.loggedIn = false;
        await req.user.save();
        res.status(200).send({ 'message': 'User has been logged out successfully' });
    }
    catch (error) {
        res.status(500).send({ 'message': 'Error occurred during logout' });
    }
});

// user logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        req.user.loggedIn = false;
        await req.user.save();
        res.status(200).send({ 'message': 'Logged out from all the sessions successfully' });
    }
    catch (error) {
        res.status(500).send({ 'message': 'Error occurred during all session logout' });
    }
});

module.exports = router;