const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Nomor 6
  public_users.post("/register", (req,res) => {
    const {username, password} = req.body;
    if(username === undefined || username === null || username === ""){
      return res.status(404).json({msg: "Username is required"});
    }else{
      if(password === undefined || password === null || password === ""){
        return res.status(404).json({msg: "Password is required"});
      }else{
        if (users.some(user => user.username === username)) {
          return res.status(400).json({ msg: "Username already exists" });
        }
        else{
          users.push({username, password});
          return res.status(200).json({msg: "User created successfully"});
        }
      }
    }
  });


// Testing API Users
public_users.get('/checkData', function(req, res){
  return res.status(200).json({users: users});
});

// Nomor 1
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json(books);
});


// Nomor 2
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = await req.params.isbn;
  const book = books[isbn];
  
  if(isbn === undefined || isbn === null || isbn == ""){
    return res.status(400).json({message: "ISBN is required"});
  }
  else{ 
    if(book === undefined){
      return res.status(404).json({message: "Book not found"});
    }
    else{
      return res.status(200).json({ [isbn]: book });
    }
  }
 });
  
// Nomor 3
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = await req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if(author === undefined || author === null || author === ""){
    return res.status(400).json({message: "Author is required"});
  }
  else{
    // console.log(booksByAuthor.map(book => book.title));
    return res.status(200).json({ books: booksByAuthor });
  }
});

// Nomor 4
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = await req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if(booksByTitle === undefined || booksByTitle === null || booksByTitle === ""){
    return res.status(400).json({msg:"Title is Required"});
  }else{
    return res.status(200).json({books: booksByTitle});
  }

});

// Nomor 5
//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  const isbn =  await req.params.isbn;
  const book = books[isbn]; 
  console.log(book)
  if(isbn === undefined || isbn === null || isbn === ""){
    return res(400).json({message: "ISBN is required"});
  }
  else{
    if(book === undefined){
      return res.status(404).json({message: "Book not found"});
    }
    else{
      return res.status(200).json({reviews: book.reviews});
    }
  }

});

module.exports.general = public_users;
