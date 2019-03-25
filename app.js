const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// static folder for serving html...
app.use(express.static(path.join(__dirname, 'public')));

// Signup Route
app.post('/signup', (req, res) => {
	// get the data submitted in the former, using body-parser. This enables "req.body"

	// using destructuring, we can create an object with the contents of our form
	const {firstName, lastName, email} = req.body;

	// Field validation
	if(!firstName || !lastName || !email) {
		//redirect to fail page
		res.redirect('/fail.html');
		return;
	}

	// construct the req data - per the requirements specified in the mailchimp API documentation
	const data = {
		members: [
			{
				email_address: email,
				status: 'subscribed',
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	}

	// since mailchimp wants strings, not objects...
	const postData = JSON.stringify(data);

	// if we're here, we can make the request to the mailchimp module
	const options = {
		// url, method, api key, header...
		url: 'https://us20.api.mailchimp.com/3.0/lists/2b08d94c35',
		method: 'POST',
		headers: {
			Authorization: 'auth 025837d369fd1535b3ebb9cb1d2fabca-us20'
		},
		body: postData
	}

	request(options, (err, response, body) => {
		if(err) {
			res.redirect('/fail.html');
			setTimeout(() => {
				res.redirect('/');
			}, 3000);
		} else {
			// check for status code/response
			if(response.statusCode === 200) {
				res.redirect('/success.html')
				setTimeout(() => {
					res.redirect('/');
				}, 3000);
			} else {
				res.redirect('/fail.html');
				setTimeout(() => {
					res.redirect('/');
				}, 3000);
			}
		}
	})

	// res.send('henlo'); //redirect to /signup, display 'henlo' in page
});

// start the server on port 500 if local
const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on ${port})`));
