const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { Routes, Messages } = require("../constants");
const Book = require("../models/Book");
const { buildDatabaseResponse } = require("../api");

router.get('/', async (req, res) => {
  console.log(req.user);
  const { cart } = await User.findById(req.user._id).populate('cart.book');
  res.json({ cart });
});

router.post('/', async (req, res) => {
  const { id } = req.body;
  if(!id) {
    return res.status(400).json({ message: 'Bad Request' });
  }

  const { cart } = req.user;
  const itemFound = cart.find((cartItem) => cartItem.book.equals(id));
  if(itemFound) {
    await User.updateOne({ '_id': req.user._id, 'cart.book': itemFound.book }, { '$set': { 'cart.$.quantity': itemFound.quantity + 1 } });
  } else {
    await User.findByIdAndUpdate(req.user._id, { $push: { cart: { book: id } } });
  }

  res.status(201).json({ message: Messages.addToCartSuccess });
})

router.post('/remove', async(req, res) => {
  const { id, remove } = req.body;
  const { cart } = req.user;
  const item = cart.find((cartItem) => cartItem.book.equals(id));

  if(item === undefined) {
    return res.status(400).json({ message: 'No Cart Item.' })
  }

  if(remove) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { cart: { book: id } } });
  } else {
    if(item.quantity === 1) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { cart: { book: id } } });
    } else {
      await User.updateOne({ '_id': req.user._id, 'cart.book': item.book }, { '$set': { 'cart.$.quantity': item.quantity - 1 } });
    }
  }
  res.status(204).json({ message: Messages.removeFromCartSuccess });
})

module.exports = router;