const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.send("Cannot Register");
  } else {
    let user = users.filter((user)=>{
        return (user.username===username);
    })
    if (user.length > 0) {
        return res.send("Username exists");
    } else {
        users.push({"username":username, "password":password});
        return res.send("Registration successful. Welcome! "+username);
    }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    return res.send(books[parseInt(req.params.isbn)]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    for(let bookID in books) {
        if (books[bookID].author === req.params.author) {
            res.send(books[bookID]);
        }
    }
    return res.send("Book not found");
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    for(let bookID in books) {
        if (books[bookID].title === req.params.title) {
            res.send(books[bookID]);
        }
    }
    return res.send("Book not found");
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.send(books[parseInt(req.params.isbn)].reviews);
});

module.exports.general = public_users;
