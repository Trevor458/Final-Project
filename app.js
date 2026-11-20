
const express = require("express");
const path = require("path");

const app = express();

// Set up EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));


// Import the Express Generator routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Connect the routes
app.use("/", indexRouter);
app.use("/users", usersRouter);


// Export the app for Express Generator's bin/www
module.exports = app;
