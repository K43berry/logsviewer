const express = require("express");
const cors = require("cors");


const app = express();

require('dotenv').config();

var corsOptions = {
  origin: process.env.FRONTEND_LINK,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
};

app.use(cors(corsOptions));



// parse requests of content-type - application/json
app.use(express.json( {limit: '64mb'}));  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "running" });
});

require("./app/route/route.sql")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
