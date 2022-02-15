const { default: axios } = require("axios");

const API_KEY = "AIzaSyCn9LAOhowSc-llTZqBxWZ6c6BQJP5Au8g";

const BASE_URL_VOLUMES = 'https://www.googleapis.com/books/v1/volumes';

//const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?key=${API_KEY}&q=${query}`)

function buildResponse(response) {
  return response.data.items.map((result) => ({
    title: result.volumeInfo.title,
    authors: result.volumeInfo.authors.join(' | '),
    pageCount: result.volumeInfo.pageCount,
    image: result.volumeInfo.imageLinks.thumbnail,
    published: result.volumeInfo.publishedDate 
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