const mongoose = require('mongoose');

//var dbURI = "mongodb+srv://archanaai:archanaai@cluster0.twow8.mongodb.net/loc8r";
 const dbURI="mongodb://localhost:27017/";
mongoose.connect(dbURI);

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ${dbURI}');  
});
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
 
require("./sign-in")
require("./register")