const express = require('express');
const request = require('request');
const bodyParses = require('body-parser');
const path = require('path');

const app = express();

// static folder for serving html...
app.use(express.static(path.join(__dirname, 'public')));

// start the server on port 500 if local
const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on ${port})`));
