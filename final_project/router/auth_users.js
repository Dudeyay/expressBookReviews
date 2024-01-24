const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
    if (!username || !password) {
        return res.send("Body empty");
    } else {
        let user = users.filter((user)=>{
            return (user.username===username && user.password===password);
        })
        if (user.length > 0) {
            let accessToken = jwt.sign({data:password},'access',{expiresIn: 60*60});
            req.session.authorization = {
                accessToken,username
            }
            return res.send("User successfully logged in");
        } else {
            return res.status(208).json({message: "Invalid Login. Check username and password"});
        }
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    res.send(username+"! Your review is \""+review+"\"");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let username = req.session.authorization.username;
    
    let isbn = req.params.isbn;
    let reviews = books[isbn].reviews[username];
    
    
    delete books[isbn].reviews[username];
    
    
    res.send("Reviews deleted. Here are you deleted reviews: "+reviews);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
