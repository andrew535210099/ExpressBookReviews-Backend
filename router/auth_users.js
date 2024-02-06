const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; 

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(user => user.username === username);
  return user && user.password === password;
}

// Nomor 7
//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({ msg: "Username and password are required" });
  } else {
    if (!isValid(username)) {
      return res.status(400).json({ msg: "Username is invalid" });
    } else {
      if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username: username }, "fingerprint_customer");
        return res.status(200).json({ msg: "Customer successfully registered. Now you can login" });
      } else {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }
  }
});

// Nomor 8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const data = req.body;
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (isbn === undefined || isbn === null || isbn === "") {
    return res.status(400).json({ message: "ISBN is required" });
  } else {
    if (book === undefined) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      if (data === undefined || data === null || data === "") {
        return res.status(400).json({ message: "Review is required" });
      } else {
        if (book.reviews === undefined) {
          book.reviews = {};
        }
        book.reviews[req.username] = data;
        return res.status(200).json({ message: `The review for the book '${isbn}' with ISBN has been Added/ Updated` });
      }
    }
  }
});

// Nomor 9
// Delete a book review
// regd_users.delete("/auth/review/:isbn", (req, res) => {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (isbn === undefined || isbn === null || isbn === "") {
//     return res.status(400).json({ message: "ISBN is required" });
//   } else {
//     if (book === undefined) {
//       return res.status(404).json({ message: "Book not found" });
//     } else {
//       if (book.reviews === undefined) {
//         return res.status(404).json({ message: "No reviews found" });
//       } else {
//         if (book.reviews[req.username] === undefined) {
//           return res.status(404).json({ message: "Review not found" });
//         } else {
//           delete book.reviews[req.username];
//           return res.status(200).json({ message: `The review for the book with ISBN ${isbn} has been added/updated` });
//         }
//       }
//     }
//   }
// });

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Tulis kode Anda di sini
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (isbn === undefined || isbn === null || isbn === "") {
    return res.status(400).json({ message: "ISBN is required" });
  } else {
    if (book === undefined) {
      return res.status(404).json({ message: "Book not found" });
    } else {
      if (book.reviews === undefined) {
        return res.status(404).json({ message: "No reviews found" });
      } else {
        delete book.reviews;
        return res.status(200).json({ message: `All reviews for the book with ISBN ${isbn} have been deleted` });
      }
    }
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;