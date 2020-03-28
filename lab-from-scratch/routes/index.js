const express = require('express');
const app = express();
const userModel = require('../models/Users');

app.get('/', (request, response) => {
    response.render('index');
});

module.exports = app;