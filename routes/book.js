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
const { isInWishlistIds, getCartQuantiy } = require("../util");

router.get('/', async (req, res) => {
  const { search, priceFilter, pageFilter, language } = req.query;
  let q = {};
  if(priceFilter && priceFilter !== 'Any') {
    const priceRange = priceFilter.split('-');
    const l = parseInt(priceRange[0].slice(0, priceRange[0].length-1));
    let h = 1000000;
    if(priceRange[1] !== 'above') {
      h = parseInt(priceRange[1].slice(0, priceRange[1].length-1));
    }
    q = { price: { $gt: l, $lt: h } };
  }
  if(pageFilter && pageFilter !== 'Any') {
    const pageRange = pageFilter.split('-');
    const l = parseInt(pageRange[0]);
    let h = 100000;
    if(pageRange[1] !== 'above') {
      h = parseInt(pageRange[1]);
    }
    q = { ...q, pages: { $gt: l, $lt: h } };
  }
  if(language && language !== 'Any') {
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
  books = buildDatabaseResponse(books);
  books.forEach((book) => {
    //book.search = search;
    if(isInWishlistIds(req.user, book.id)) {
      book.inWishlist = true;
    }
    book.quantity = getCartQuantiy(req.user, book.id);
  })
  res.render('books', { user: req.user, books, message: req.flash("message") });
});

router.get('/add', checkIfAdmin, (req, res) => {
  res.render('add-book', { user: req.user, message: req.flash("message") });
})

router.post('/add', checkIfAdmin, upload.single('coverImage'), async (req, res) => {
  const { isbn, title, price, authors, pages, language, publisher, publishDate, description, genres } = req.body
  const coverImage = `/uploads/${req.file.originalname}`;
  const book = new Book({ isbn, title, price, author: authors, pages, genres: genres.split(','), publisher, publishDate, language, description, coverImage });
  book.save().then(() => {
    req.flash('message', Messages.addBookSuccess);
    res.redirect(Routes.inventory);
  }).catch((err) => {
    req.flash("message", { type: "Error", message: "Book Validation failed" });
    res.redirect(Routes.addbook);
  });
});

router.get('/update/:id', checkIfAdmin,  async (req, res) => {
  const { id } = req.params;
  console.log(id);
  let book = await Book.findById(id);
  if(book) {
    const genres = book.genres.join(',');
    console.log(genres);
    let publishDate = "2007-05-12"
    if(book.publishDate) {
      const date = new Date(book.publishDate);
      const month = date.getMonth();
      const din = date.getDate();
      publishDate = `${date.getFullYear()}-${month < 10 ? '0'+month : month}-${din < 10 ? '0'+din : din}`;
    }
    console.log(publishDate);
    res.render('update-book', { user: req.user, book: buildDatabaseResponse([book]), language: book.language, genres, publishDate, message: req.flash('message') });
  } else {
    req.flash("message", { type: "Error", message: "Invalid Book Id" });
    res.redirect(Routes.inventory);
  }
})

router.post('/update', checkIfAdmin, upload.single('coverImage'), async (req, res) => {
  
  const { id, isbn, title, price, authors, pages, language, publisher, publishDate, description, genres } = req.body;
  const coverImage = req.file ? `/uploads/${req.file.originalname}` : '';
  
  let book = {}
  
  if(coverImage) {
    book = { title, price, author: authors, pages, genres: genres.split(','), publisher, publishDate, language, description, coverImage };
  } else {
    book = {isbn, title, price, author: authors, pages, genres: genres.split(','), publisher, publishDate, language, description };
  }

  try {
    await Book.findByIdAndUpdate(id, book);
    req.flash("message", { type: "success", message: "Succesfully updated book" });
    res.redirect(Routes.inventory);
  } catch(err) {
    console.error(err);
    req.flash("message", { type: "error", message: "Problem in updating book." });
    res.redirect(Routes.updateBook);
  }
});

router.post('/remove', checkIfAdmin, (req, res) => {
  const { id } = req.body;
  Book.findByIdAndDelete(id).then(() => {
    req.flash("message", )
    res.redirect(Routes.inventory);
  });
})

module.exports = router;