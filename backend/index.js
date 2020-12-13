const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");
var cors = require('cors')
app.use(cors())
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require("./routes/index.routes"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});


app.listen(PORT);
console.log(`Listening on ${PORT}`);
