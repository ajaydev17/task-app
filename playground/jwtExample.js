const jwt = require('jsonwebtoken');

const myFunction = async () => {
    const token = jwt.sign({ "_id": "abcd" }, "thisisanewtoken", { expiresIn: "7 days" });
    console.log(token);

    const data = jwt.verify(token, "thisisanewtoken");
    console.log(data);
};

myFunction();