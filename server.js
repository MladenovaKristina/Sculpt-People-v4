const express = require('express');
const compression = require('compression');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

const webpackStaticPath = path.resolve(__dirname, 'build');

app.use(compression());

// the __dirname is the current directory from where the script is running
app.use(express.static(webpackStaticPath));

// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(webpackStaticPath, 'index.html'));
});

app.listen(port);

console.log(`App listening on ${port}`);
