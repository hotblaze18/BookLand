const express = require("express");
const { getBooks } = require("../api");
const router = express.Router();

router.get('/', async (req, res) => {
  const query = req.query.q;
  const books = await getBooks(query);
  res.render('books', { user: req.user, books, message: req.flash("message") });
});

module.exports = router;