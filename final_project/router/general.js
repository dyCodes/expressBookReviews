const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	//Write your code here
	return res.status(300).json({ message: 'Yet to be implemented' });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	let result = books;
	return res.status(200).json(result);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	const book = books[isbn];
	if (!book) {
		return res.status(404).json({ error: 'Book not found!' });
	} else {
		return res.status(200).json(book);
	}
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const author = req.params.author;
	const result = [];

	// Obtain all the keys for the 'books' object
	const bookKeys = Object.keys(books);
	bookKeys.forEach((key) => {
		if (books[key].author === author) {
			result.push({ isbn: key, ...books[key] });
		}
	});

	if (result.length === 0) return res.status(404).json({ error: 'No books found for the author!' });
	return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	const title = req.params.title.toLowerCase();
	const result = [];

	// Obtain all the keys for the 'books' object
	const bookKeys = Object.keys(books);
	bookKeys.forEach((key) => {
		if (books[key].title.toLowerCase() === title) {
			result.push({ isbn: key, ...books[key] });
		}
	});

	if (result.length === 0) return res.status(404).json({ error: 'No books found with the given title!' });
	return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.general = public_users;
