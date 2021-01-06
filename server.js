const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist/paypalproject'));
// Start the app by listening on the default
// Heroku port

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist'}
);
});
app.listen(process.env.PORT || 8080);
