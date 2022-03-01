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
const auth = require("./routes/auth");;
const book = require('./routes/book');
const admin = require('./routes/admin');
const { getRecomendedBooks } = require('./api');
const hbshelpers = require('handlebars-helpers');
const redirectIfNotLoggedIn = require('./middleware/redirectIfNotLogged');
const checkIfAdmin = require('./middleware/checkIfAdmin');
const { Routes } = require('./constants');
const Book = require('./models/Book');
const multihelpers = hbshelpers(['object', 'string']);
const helpers = {
  eq: function(a, b, options){
    if (a === b) {
      return true;
      }
    return false;
  },
}

//setup view engine
app.engine('hbs', hbs({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: __dirname + '/views/layouts/',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {...multihelpers, ...helpers }, 
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//other setup
app.use(express.json());
app.use(bodyParser());
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

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
  // /** To insert initial 2000 books in database (execute only once) **/
  // const books = require('./books.json');
  // await Book.insertMany(books);
  // console.log('inserted');  
}).catch((err) => {
  console.log('db connection failed with ', err);
})

//routes
app.use("/auth", auth);
app.use('/books', redirectIfNotLoggedIn, book);
app.use('/admin', redirectIfNotLoggedIn, checkIfAdmin, admin);

app.get('/', (req, res) => {
  const user = req.user;
  if(user && user.role === 'admin') {
    res.redirect(Routes.admin);
  } else {
    res.redirect(Routes.home);
  }
})

app.get('/home', redirectIfNotLoggedIn,  async (req, res) => {
  console.log(req.session.message, req.isAuthenticated());
  
  const latestBooks = await getRecomendedBooks();
  console.log(latestBooks);

  res.render('home', { latestBooks, user: req.user, message: req.flash('message')  });
}); 

module.exports = app;