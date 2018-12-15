const express = require('express'),
    api = express.Router(),
    userRouter = require('./routes/UserRouter');

api.use(userRouter);
module.exports = api;