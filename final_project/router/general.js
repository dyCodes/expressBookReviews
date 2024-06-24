const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res.status(400).json({ message: 'Username and password are required.' });
	}

	if (isValid(username)) {
		// Add the user to the users array
		users.push({ username, password });
		return res.status(201).json({ message: 'Customer registered successfully.' });
	} else {
		return res.status(400).json({ message: 'Invalid username.' });
	}
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
	try {
		const getBooks = () => new Promise((resolve) => resolve(books));
		const result = await getBooks();
		return res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ message: 'Error fetching books', error: error.message });
	}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
	try {
		const getBookDetails = (isbn) =>
			new Promise((resolve, reject) => {
				const book = books[isbn];
				if (!book) {
					reject('Book not found!');
				} else resolve(book);
			});

		const isbn = req.params.isbn;
		const result = await getBookDetails(isbn);
		return res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error || 'Error fetching book details' });
	}
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
	const author = req.params.author;

	const getBooksByAuthor = (author) => {
		return new Promise((resolve) => {
			const filteredBooks = Object.keys(books)
				.filter((key) => books[key].author === author)
				.map((key) => ({ isbn: key, ...books[key] }));
			resolve(filteredBooks);
		});
	};

	try {
		const booksByAuthor = await getBooksByAuthor(author);
		if (booksByAuthor.length === 0) return res.status(404).json({ error: 'No books found for the author!' });
		return res.status(200).json(booksByAuthor);
	} catch (error) {
		return res.status(500).json({ error: 'Error fetching books by author' });
	}
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
	const title = req.params.title.toLowerCase();

	const getBooksByTitle = async (title) => {
		return new Promise((resolve) => {
			const filteredBooks = Object.keys(books)
				.filter((key) => books[key].title.toLowerCase() === title)
				.map((key) => ({ isbn: key, ...books[key] }));
			resolve(filteredBooks);
		});
	};

	try {
		const booksByTitle = await getBooksByTitle(title);
		if (booksByTitle.length === 0)
			return res.status(404).json({ error: 'No books found with the given title!' });
		return res.status(200).json(booksByTitle);
	} catch (error) {
		return res.status(500).json({ error: 'Error fetching books by title', details: error.message });
	}
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
	const isbn = req.params.isbn;
	const book = books[isbn];

	if (!book) return res.status(404).json({ error: 'Book not found!' });
	return res.status(200).json({ reviews: book.review });
});

module.exports.general = public_users;
