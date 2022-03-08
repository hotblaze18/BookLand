const express = require("express");
const { getBooks, buildDatabaseResponse } = require("../api");
const checkIfAdmin = require("../middleware/checkIfAdmin");
const router = express.Router();
const multer  = require('multer');
const upload = require("../multer");
const Book = require("../models/Book");
const { Routes, Messages } = require("../constants");
const path = require('path');
const { query } = require("express");

router.get('/', async (req, res) => {
  console.log(req.query);
  const { search, priceFilter, pageFilter, language } = req.query;
  let q = {};
  if(priceFilter !== 'Any') {
    const priceRange = priceFilter.split('-');
    const l = parseInt(priceRange[0].slice(0, priceRange[0].length-1));
    let h = 1000000;
    if(priceRange[1] !== 'above') {
      h = parseInt(priceRange[1].slice(0, priceRange[1].length-1));
    }
    q = { price: { $gt: l, $lt: h } };
  }
  if(pageFilter !== 'Any') {
    const pageRange = pageFilter.split('-');
    const l = parseInt(pageRange[0]);
    let h = 100000;
    if(pageRange[1] !== 'above') {
      h = parseInt(pageRange[1]);
    }
    q = { ...q, pages: { $gt: l, $lt: h } };
  }
  if(language !== 'Any') {
    q = { ...q, language }
  }
  console.log(q);
  let books = []; 
  if(search !== '') {
      books = await Book.aggregate([
        {
          $search: {
            index: 'book',
            text: {
              query: search,
              path: {
                'wildcard': '*'
              }
            }
          }
        },
        {
          $match: q
        }
      ]);
  } else {
    books = await Book.find(q); 
  }
  res.render('books', { user: req.user, books: buildDatabaseResponse(books), message: req.flash("message") });
});

router.get('/add', checkIfAdmin, (req, res) => {
  res.render('add-book', { user: req.user, message: req.flash("message") });
})

router.post('/add', checkIfAdmin, upload.single('coverImage'), async (req, res) => {
  const { isbn, title, price, authors, publisher, publishDate, description } = req.body
  const coverImage = `/uploads/${req.file.originalname}`;
  const book = new Book({ isbn, title, price, author: authors, publisher, publishDate, description, coverImage });
  book.save().then(() => {
    req.flash('message', Messages.addBookSuccess);
    res.redirect(Routes.inventory);
  }).catch((err) => {
    req.flash("message", { type: "Error", message: "Book Validation failed" });
    res.redirect(Routes.addbook);
  })
});

router.get('/update/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const book = await Book.findById(id);
  if(book) {
    console.log(book);
    res.render('update-book', { user: req.user, book, message: req.flash('message') });
  } else {
    req.flash("message", { type: "Error", message: "Invalid Book Id" });
    res.redirect(Routes.inventory);
  }
})

router.post('/remove', checkIfAdmin, (req, res) => {
  const { id } = req.body;
  Book.findByIdAndDelete(id).then(() => {
    req.flash("message", )
    res.redirect(Routes.inventory);
  });
})

module.exports = router;