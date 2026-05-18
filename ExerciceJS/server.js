const express = require("express");
const session = require("express-session");
const books = require("./books");
const app = express();

app.use(express.json());
app.use(session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
}));



app.use("/books", books);

app.listen(1000, () => {
    console.log("Server is running on port 1000");
});