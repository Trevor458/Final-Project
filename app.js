
/*
 * StudyFlow - Main server file
 * This file starts our website and displays the homepage.
 */

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Use EJS to display our HTML pages.
app.set("view engine", "ejs");

// Tell Express where to find CSS and images.
app.use(express.static(path.join(__dirname, "public")));

// Display the homepage when someone visits the website.
app.get("/", (req, res) => {
    res.render("index");
});

// Start the website server.
app.listen(PORT, () => {
    console.log(`StudyFlow is running on port ${PORT}`);
});
