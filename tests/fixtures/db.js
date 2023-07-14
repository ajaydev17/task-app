const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    "name": "Zabuza Mamochi",
    "email": "zabuza1729@gmail.com",
    "password": "zabuza@123",
    "age": 27,
    "loggedIn": true,
    "tokens": [{
        "token": jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    "name": "haku",
    "email": "haku1729@gmail.com",
    "password": "haku@123",
    "age": 27,
    "loggedIn": true,
    "tokens": [{
        "token": jwt.sign({ _id: userTwoId }, process.env.JWT_TOKEN)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task One",
    completed: true,
    owner: userOne._id
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Two",
    completed: true,
    owner: userOne._id
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Three",
    completed: true,
    owner: userTwo._id
};

const setUpDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await Task(taskOne).save();
    await Task(taskTwo).save();
    await Task(taskThree).save();
};

const disConnectDatabase = async () => {
    await mongoose.disconnect();
};

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase,
    disConnectDatabase
};