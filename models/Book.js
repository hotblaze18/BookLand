const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: true,
    //unique: true
  },
  title: {
    type: String,
    //required: true
  },
  price: {
    type: Number,
    //required: true,
    min: 0
  },
  author: {
    type: String,
    //required: true
  },
  publisher: {
    type: String,
  },
  publishDate: {
    type: Date,
  },
  coverImage: {
    type: String
  },
  avgRating: {
    type: Number,
    max: 5,
    min: 0,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    default: "Dummy Description"
  },
  language: {
    type: String,
    default: "English"
  },
  pages: {
    type: Number,
    default: '200'
  },
  genres: {
    type: [String]
  }
}, { timestamps: true })

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;