require('dotenv').config()

const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
var mongoose = require('mongoose');


const mainRoute = require('../routes/default');

//DB Connection locally DATABASE=mongodb://localhost:27017/coda
mongoose
  .connect('mongodb+srv://mern123:mern123@coda.x7odi.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

// app created
var app = express();
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//route in use
app.use('/',mainRoute);

const port = process.env.PORT ||3000;
app.listen(port, () => {
    console.log('Server connected with port : ' + port +" "+process.env.mongoUrl);
});
