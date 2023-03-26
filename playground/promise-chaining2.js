require('../src/db/mongoose');
const Task = require('../src/models/task');

// promise chaining example
Task.findByIdAndRemove('640ccfb55cf39e18c30143fa').then((task) => {
    console.log(task);
    return Task.countDocuments({ completed: false });
}).then((result) => {
    console.log(result);
}).catch((error) => {
    console.log(error);
});


// Task.countDocuments({ completed: false }).then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })

