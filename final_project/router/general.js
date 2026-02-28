const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password required"
    });
  }

  if (!isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered"
  });
});


public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/"
    );

    return res.status(200).json(response.data);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books"
    });
  }
});


public_users.get('/isbn/:isbn', async (req, res) => {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get(
      "http://localhost:5000/"
    );

    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    return res.json(book);

  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving book"
    });
  }
});


public_users.get('/author/:author', async (req, res) => {

  const author = req.params.author;

  try {
    const response = await axios.get(
      "http://localhost:5000/"
    );

    const booksByAuthor =
      Object.values(response.data)
        .filter(book => book.author === author);

    if (booksByAuthor.length === 0) {
      return res.status(404).json({
        message: "No books found for this author"
      });
    }

    res.json(booksByAuthor);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


public_users.get('/title/:title', async (req, res) => {

  const title = req.params.title;

  try {
    const response = await axios.get(
      "http://localhost:5000/"
    );

    const booksByTitle =
      Object.values(response.data)
        .filter(book => book.title === title);

    if (booksByTitle.length === 0) {
      return res.status(404).json({
        message: "No books found with this title"
      });
    }

    res.json(booksByTitle);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
});


public_users.get('/review/:isbn', async (req, res) => {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get(
      "http://localhost:5000/"
    );

    const book = response.data[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json(book.reviews);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching reviews"
    });
  }
});

module.exports.general = public_users;
