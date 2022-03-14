const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Routes, Messages } = require("../constants");
const Book = require("../models/Book");
const { buildDatabaseResponse } = require("../api");

router.get('/', async (req, res) => {
  console.log(req.user);
  const { wishlist } = await User.findById(req.user._id).populate('wishlist');
  console.log(wishlist);
  res.render('wishlist', { user: req.user, wishlist: buildDatabaseResponse(wishlist), message: req.flash("message") });
});

router.post('/', async (req, res) => {
  const { id } = req.body;
  // const book = await Book.findById(id);
  await User.findByIdAndUpdate(req.user._id, { $push: { wishlist: id } });
  req.flash("message", Messages.addWishlistSuccess);
  res.redirect(Routes.wishlist);
})

router.post('/remove', async(req, res) => {
  const { id } = req.body;
  await User.findByIdAndUpdate(req.user._id, { $pull: { wishlist: id } });
  req.flash("message", Messages.removeFromWishlistSuccess);
  res.redirect(Routes.wishlist);
})

module.exports = router;