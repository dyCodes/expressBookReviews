const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	// Username must be a string and not longer than 24 characters
	if (typeof username !== 'string' || username.length > 24) {
		return false;
	}

	// Check if user already exists
	let existingUsers = [];
	existingUsers = users.filter((user) => user.username === username);
	if (existingUsers.length > 0) return false;

	// Username must only contain alphanumeric characters and underscores
	const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
	return validUsernameRegex.test(username);
};

const authenticatedUser = (username, password) => {
	// write code to check if username and password match the one we have in records.
	let existingUser = users.find((user) => user.username === username && user.password === password);
	return !!existingUser;
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

	if (authenticatedUser(username, password)) {
		const token = jwt.sign({ username }, 'secret_key', { expiresIn: '4h' });
		req.session.auth = { token };

		return res.status(200).json({ message: 'Customer logged in successfully.' });
	} else {
		return res.status(401).json({ message: 'Invalid username or password.' });
	}
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn;
	const { review } = req.body;
	const { username } = req.user;

	// validation
	if (!review) return res.status(400).json({ message: 'Review is required.' });
	if (!books[isbn]) return res.status(404).json({ message: 'Book not found.' });

	// add review
	books[isbn].reviews[username] = review;
	console.log(review, req.user, books[isbn]);

	return res.status(200).json({ message: 'Review added successfully.', result: books[isbn] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
