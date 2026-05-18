const express = require("express");
const session = require("express-session");
const bycrypt = require("bcrypt");
const router = express.Router();

const User = require("./database");



// books = [
//     { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
//     { title: "To Kill a Mockingbird", author: "Harper Lee" },
//     { title: "1984", author: "George Orwell" }
// ];


// const USER = {
//     username: "admin",
//     password: "admin"
// };

router.post("/signUp", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send("Username and password are required");
    }
    const hashPassword = bycrypt.hashSync(password, 10); 
    const newUser = new User({ username, password: hashPassword });
    newUser.save().then(() => {
        res.status(201).send("User created successfully");
    }).catch((err) => {
        console.error("Error creating user:", err);
        res.status(500).send("Server error");
    });

});


router.post("/login", (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username }).then((user) => {
        if (user && bycrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.send("Login success");
        } else {
            res.status(401).send("Invalid credentials");
        }
    }).catch((err) => {
        console.error("Error logging in:", err);
        res.status(500).send("Server error");
    });
});


function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("Unauthorized");
    }
}

router.use(isAuthenticated);

router.get("/", (req, res) => {
    const { books } = req.session;
    if (!books || books.length === 0) {
        res.send("We have no books");
    } else {
        res.send(books);
    }
});


router.post("/AddBook", (req, res) => { 
    const { title, author } = req.body;
    if (!title || !author) {  
        return;
    }
    const newBook = { title, author };
    if (!req.session.books) {
        req.session.books = [];
    }
    req.session.books.push(newBook);
    res.status(201).send("Book added successfully");
    console.log("Book added:", newBook);
    console.log("Current books in session:", req.session.books);
});


module.exports = router;