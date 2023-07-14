const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const path = require('path');
const { userOneId, userTwoId, userOne, userTwo, taskOne, taskTwo, taskThree, setUpDatabase, disConnectDatabase } = require('./fixtures/db');

beforeEach(setUpDatabase);
afterAll(disConnectDatabase);

test('should sign-up a new user', async () => {
    const response = await request(app).post('/users').send({
        "name": "Kakashi Hatake",
        "email": "rogerthat1729@gmail.com",
        "password": "haku1729A!#",
        "age": 26
    }).expect(201);

    // Assert that database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            "name": user.name,
            "email": user.email
        },
        token: user.tokens[0].token
    });

    expect(user.password).not.toBe("haku1729A!#");
});

test('should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        "email": userOne.email,
        "password": userOne.password
    }).expect(200);

    // Assert token is valid or not
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

test('should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        "email": userOne.email,
        "password": "thisisrandompass"
    }).expect(400);
});

test('should get the profile for the user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get the profile for the unaunthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('should delete account for a user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert user is deleted properly
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
});

test('should not delete account for unaunthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
});

test('should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('upload', path.join(__dirname, '../tests/fixtures/signature.PNG'))
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Kakashi Hatake'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Kakashi Hatake');
});

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Bangalore'
        })
        .expect(400);
});