const express = require("express");
const { getBooks } = require("../api");
const checkIfAdmin = require("../middleware/checkIfAdmin");
const router = express.Router();
const multer  = require('multer');
const upload = require("../multer");
const Book = require("../models/Book");
const { Routes, Messages } = require("../constants");
const path = require('path');

router.get('/', async (req, res) => {
  const query = req.query.q;
  const books = await getBooks(query);
  res.render('books', { user: req.user, books, message: req.flash("message") });
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