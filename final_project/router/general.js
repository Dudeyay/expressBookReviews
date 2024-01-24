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
public_users.get('/', async function (req, res) {
  //Write your code here
  let response = await JSON.stringify(books, null,4)
  return res.send(response);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let response = await books[parseInt(req.params.isbn)];
    return res.send(response);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    function getBook1() {
        let found = false;
        for(let bookID in books) {
            if (books[bookID].author === req.params.author) {
                res.send(books[bookID]);
                found = true;
            }
        }   
    
    
    
        if (!found) {
            return res.send("Book not found");
        }
    }
    await getBook1();
    
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    function getBook2() {
        let found = false;
            for(let bookID in books) {
                if (books[bookID].title === req.params.title) {
                    res.send(books[bookID]);
                    found = true;
                }
            }
            if (!found) {
                return res.send("Book not found");
            }
    }
    await getBook2();
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.send(books[parseInt(req.params.isbn)].reviews);
});

module.exports.general = public_users;
