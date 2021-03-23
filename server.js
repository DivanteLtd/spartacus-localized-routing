//Install express server
const express = require("express");
const path = require("path");

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/spartacus-localized-routing"));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname + "/dist/spartacus-localized-routing/index.html")
  );
});

// Start the app by listening on the default Heroku port or 8080 locally
app.listen(process.env.PORT || 8080);
