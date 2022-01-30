const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const mongoose=require('mongoose');


const app = express();

//set view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//connect to mongo db
mongoose.connect('mongodb+srv://bookland:bookland@cluster0.yk4sm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(() => {
  console.log('connected to db');
}).catch((err) => {
  console.log('db connection failed with ', err);
})

module.exports = app;