const express = require("express");
const { getDatabaseBooks } = require("../api");
const router = express.Router();
const { Routes, Messages, Roles } = require("../constants");

router.get('/', async (req, res) => {
  const books = await getDatabaseBooks();
  res.render('admin', {  user: req.user, books, message: req.flash('message')  });
});

router.get('/inventory', async (req, res) => {
  const books = await getDatabaseBooks();
  res.render('inventory', { user: req.user, books, message: req.flash('message') });
})

module.exports = router;