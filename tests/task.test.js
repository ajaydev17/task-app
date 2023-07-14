const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const { userOneId, userTwoId, userOne, userTwo, taskOne, taskTwo, taskThree, setUpDatabase, disConnectDatabase } = require('./fixtures/db');

beforeEach(setUpDatabase);
afterAll(disConnectDatabase);

test('should create a new task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "description": "From my test"
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

    expect(task.completed).toEqual(false);
});

test('should read the user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});

test('should not delete other users tasks', async () => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Beared ${userTwo.tokens[0].token}`)
        .send()
        .expect(401);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});