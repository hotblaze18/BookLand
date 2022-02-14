const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const hbs = require('express-handlebars');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const app = express();
const util = require('util');
const cors = require("cors");
const session = require("express-session");
const flash = require('req-flash');
const MongoStore = require("connect-mongo")(session);
const passport = require("./passport/setup");
const auth = require("./routes/auth");

//setup view engine
app.engine('hbs', hbs({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: __dirname + '/views/layouts/',
  handlebars: allowInsecurePrototypeAccess(Handlebars) 
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//other setup
app.use(express.json());
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

//Set up Express Session
app.use(
    session({
        secret: "mySecret",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set up Express Session
app.use(
    session({
        secret: "mySecret",
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

//set up flash
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect to mongo db using connection string
mongoose.connect('mongodb+srv://bookland:bookland@cluster0.vwbxz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(async () => {
  console.log('connected to db');
  /** To insert initial 2000 books in database (execute only once) **/
  // const books = require('./books.json');
  // await Book.insertMany(books);
  // console.log('inserted');  
}).catch((err) => {
  console.log('db connection failed with ', err);
})

//routes
app.use("/auth", auth);

app.get('/', async (req, res) => {
  console.log(req.session.message, req.isAuthenticated());
  //fetch all the books
  // const allBooks = await Book.find();

  // //dummy data for most popular and latest books
  // const mostPopularBooks = allBooks.slice(26, 30);
  // const latestBooks = allBooks.slice(100, 104);

  res.render('home', { latestBooks: [], mostPopularBooks: [], user: req.user, message: req.flash('message')  });
});

module.exports = app;