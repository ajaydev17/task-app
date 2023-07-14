const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'rogerthat1729@gmail.com',
        pass: process.env.PASS_KEY
    }
});

const sendWelcomeEmail = (email, name) => {

    const html = `
        <h1>Hi ${name}!!</h1>
        <p>Welcome to the app, let me know how you get along with the application.</p>
    `;

    const info = transporter.sendMail({
        from: 'Roger That <rogerthat1729@gmail.com>',
        to: email,
        subject: 'Thanks for joining us!!',
        html: html
    });

    console.log('message sent successfully!!');

};

const sendCancellationEmail = (email, name) => {
    const html = `
        <h1>Hi ${name}!!</h1>
        <p>Goodbye, hope to see you back sometime soon!!.</p>
    `;

    const info = transporter.sendMail({
        from: 'Roger That <rogerthat1729@gmail.com>',
        to: email,
        subject: 'Sorry to see you go!!',
        html: html
    });

    console.log('message sent successfully!!');
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};