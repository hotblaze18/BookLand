const { default: axios } = require("axios");
const Book = require("./models/Book");

const API_KEY = "AIzaSyCn9LAOhowSc-llTZqBxWZ6c6BQJP5Au8g";

const BASE_URL_VOLUMES = 'https://www.googleapis.com/books/v1/volumes';

//const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?key=${API_KEY}&q=${query}`)

function buildResponse(response) {
  console.log(response.data.items[0].volumeInfo);
  return response.data.items.map((result) => ({
    title: result.volumeInfo.title,
    authors: result.volumeInfo.authors.join(' | '),
    pageCount: result.volumeInfo.pageCount,
    image: result.volumeInfo.imageLinks?.thumbnail,
    published: result.volumeInfo.publishedDate 
  }));
}

module.exports.buildDatabaseResponse = (books) => {
  // console.log(books[0]);
  return books.map((book) => ({
    id: book._id,
    title: book.title,
    authors: book.author,
    pageCount: book.pages,
    image: book.coverImage,
    published: book.publishDate
  }));
}

module.exports.getBooks = async (query) => {
  const response = await axios.get(BASE_URL_VOLUMES, {
    params: {
      key: API_KEY,
      q: query
    }
  });

  return buildResponse(response);
}

module.exports.getDatabaseBooks = async (query) => {
  const books = await Book.find().sort({ createdAt: -1 }).limit(100);
  return buildDatabaseResponse(books);
}

module.exports.getRecomendedBooks = async () => {
  const response = await axios.get(BASE_URL_VOLUMES, {
    params: {
      key: API_KEY,
      maxResults: 12,
      orderBy: 'newest',
      q: 'books'
    }
  });

  return buildResponse(response);
}