const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userModel = require('../models/Users');


//Rendering the sign up page
app.get('/signup', (request, response) => {
    response.render('signup');
});

app.post('/signup', (request, response, next) => {
    const username = request.body.username;
    const password = request.body.password;

    bcrypt.hash(password, saltRounds, function(error, hash) {
        if(error) {
            next("Hasing error!")
        } else {
            userModel
            .create({
                username: request.body.username,
                password: hash
            })
            .then((userInfo) => {
                response.redirect('/signup');
            })
            .catch((error) => {
                response.send(error);
            });
        }
        
    });
    
});

//Login page
app.get('/login', (request, response) => {
    response.render('login');
});

app.post('/login', (request, response, next) => {
    console.log(request.body);
    const username = request.body.username;
    const password = request.body.password;

    userModel
        .findOne({username})
        .then((userInfo) => {
            console.log(request.body);
            // if(username !== userInfo.username) {
            if(!userInfo) {
                response.send("Invalid credentials.");
            } else {
                bcrypt.compare(password, hash, function(error, result) {
                    if(error) {
                        next("Hash comparison error.")
                    } else if (!result) {
                        response.send("password incorrect")
                    } else {
                        request.session.currentUser = userInfo;
                        response.redirect('/profile');
                    }
                });
            }
            
            //plain text password
            // else if (userInfo.password !== password) {
            //     response.send("Invalid credentials.");
            // } else {
            //     request.session.currentUser = userInfo;
            //     response.redirect('/profile');
            // }
        })
        .catch((error) => {
            response.send(error);
        });
});

//Render profile page
app.get('/profile', (request, response) => {
    response.render('profile');
});

module.exports = app;