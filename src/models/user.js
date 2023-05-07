// import mongoose module
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

// define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is invalid!!');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive integer');
            }
        }
    },
    loggedIn: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// defination of the virtual schema on the task model (virtual schema is not stored in the database but its attached to respective document)
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// define an index on the "email" field
userSchema.index({ email: 1 }, { unique: true });

// methods will be applied on the instance of the schema/model

// defination of toJSON method which will be called on the instance of the schema when the data is stringified and sent
userSchema.methods.toJSON = function () {
    const user = this;

    const userObject = user.toObject();

    // deleting the properties so that it will not be show in the response body
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

// defination of the method for token generation
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // jws token creation with a secret key, its base64 encoded string with header, payload, signature info
    const token = jwt.sign({ _id: user._id.toString() }, "thisisanewtoken");

    // add token to user data
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
};


// statics will be applied on the schema/model itself.
// defination of the custom function that can be attached to a schema, no need to create the instance
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email: email });

    if (!user) {
        throw new Error('Unable to login!!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Unable to login!!');
    }

    return user;
};

// defination of the middleware for save
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

// defination of the middleware for remove user
userSchema.pre('deleteOne', { document: true }, async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });
    next();
});

// defination of the middleware for findOneAndUpdate
// userSchema.pre('findOneAndUpdate', async function (next) {
//     const user = this;

//     console.log('middleware just before updating');

//     next();
// });

// create a user model
const User = mongoose.model('User', userSchema);

// define create index on the model for email field
// another way of implementing unique email validation
// User.createIndexes();

module.exports = User;