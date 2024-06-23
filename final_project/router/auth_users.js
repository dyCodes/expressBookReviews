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
	//returns boolean
	//write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	return res.status(300).json({ message: 'Yet to be implemented' });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	//Write your code here
	return res.status(300).json({ message: 'Yet to be implemented' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
