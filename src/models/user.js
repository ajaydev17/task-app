// import mongoose module
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
    }
});

// define an index on the "email" field
userSchema.index({ email: 1 }, { unique: true });

// define the custom function that can be attached to a collection
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