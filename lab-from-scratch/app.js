require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
const hbs = require('hbs');
const mongoose = require('mongoose');
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(session({
  secret: "basic-auth-secret",
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

// app.use('profile', userProtect);

mongoose
  .connect(process.env.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((connectionInfo) => {
    console.log("SUCCESS - Connected to the database!");
  })
  .catch((error) => {
    console.log("ERROR - Not connected to the database", error);
  });

// function userProtect (request, response, next) {
//   if (request.session.currentUser) {
//     response.render('/profile');
//   } else {
//     response.redirect('/login');
//   }
//   next();
// }

app.use('/', require('./routes/index'));
app.use('/', require('./routes/user'));

app.listen(process.env.PORT, () => {
    console.log('SUCCESS - Server successfully started!', process.env.PORT);
});