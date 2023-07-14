// import mongoose module
const mongoose = require('mongoose');

// define the uri and options
const uri = process.env.MONGO_URI;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// connect to mongo database
mongoose.connect(uri, options)
    .then(() => console.log('connected to mongodb successfully!!'))
    .catch((error) => console.log('oops, connection to mongodb failed!! with error ', error));

// mongoose.connect(uri, options);

// mongoose.connections.on('connected', () => {
//     console.log('connected to mongodb successfully!!');
// });

// mongoose.connection.on('error', (error) => {
//     console.log('oops, connection to mongodb failed!! with error ', error);
// });