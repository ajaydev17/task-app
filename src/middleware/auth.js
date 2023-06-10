const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {
        // get the token passed in the header of the request
        const token = req.header('Authorization').replace('Bearer ', '');
        // get the base64 decoded value from the token
        const decoded = jwt.verify(token, 'thisisanewtoken');

        // get the user info using the token values
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token, loggedIn: true });
        if (!user) {
            throw new Error('Not a auntheticated user');
        }

        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send({ 'error': 'please auntheticate or login to your account!!' });
    }
};

module.exports = auth;