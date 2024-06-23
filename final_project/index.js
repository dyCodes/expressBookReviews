const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use('/customer', session({ secret: 'fingerprint_customer', resave: true, saveUninitialized: true }));

// Middleware
app.use('/customer/auth/*', function auth(req, res, next) {
	//Write the authenication mechanism here
	if (req.session.auth) {
		const token = req.session.auth.token;

		// verify JWT token
		jwt.verify(token, 'secret_key', (err, data) => {
			if (err) {
				return res.status(401).json({ error: 'Unauthorized access.' });
			}
			// set the user in the request object
			req.user = data;
			next();
		});
	} else {
		return res.status(401).json({ error: 'User not authenticated.' });
	}
});

const PORT = 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

app.listen(PORT, () => console.log('Server is running'));
