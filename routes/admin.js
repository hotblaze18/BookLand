const express = require("express");
const { getDatabaseBooks, buildDatabaseResponse } = require("../api");
const router = express.Router();
const { Routes, Messages, Roles } = require("../constants");
const Book = require("../models/Book");

router.get('/', async (req, res) => {
  const books = await getDatabaseBooks();
  res.render('admin', {  user: req.user, books, message: req.flash('message')  });
});

router.get('/inventory', async (req, res) => {
  const books = await getDatabaseBooks();
  res.render('inventory', { user: req.user, books, message: req.flash('message') });
})

router.get('/inventory/search', async (req, res) => {
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
  res.render('inventory', { user: req.user, books: buildDatabaseResponse(books), message: req.flash('message') });
})

module.exports = router;