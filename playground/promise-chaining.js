require('../src/db/mongoose');
const User = require('../src/models/user');

// promise chaining example
User.findByIdAndUpdate('640397d0cac99e85841bb3c1', { age: 27 }).then((user) => {
    console.log(user);
    return User.countDocuments({ age: 27 });
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});