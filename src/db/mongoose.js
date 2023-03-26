// import mongoose module
const mongoose = require('mongoose');

// define the uri and options
const uri = 'mongodb://127.0.0.1:27017/task-manager-api';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// connect to mongo database
mongoose.connect(uri, options)
    .then(() => console.log('connected to mongodb successfully!!'))
    .catch((error) => console.log('oops, connection to mongodb failed!! with error ', error));