const { v4: uuidv4 } = require("uuid");

let books = [
  {
    id: "1",
    title: "The Gate Gatsby",
    authorId: "1",
    isbn: "978-0743273565",
    genre: "Fiction",
    publishedYear: 1925,
    price: 12.99,
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Clean Code",
    authorId: "2",
    isbn: "978-0132350884",
    genre: "Technology",
    publishedYear: 2008,
    price: 35,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Book Model - CRUD operations
const BookModel = {
  // Get All Books
  findAll() {
    return books;
  },
  // Get book by id
  findById(id) {
    return books.find((book) => book.id === id) || null;
  },
  // Get book by isbn
  findByIsbn(isbn) {
    return books.find((book) => book.isbn === isbn) || null;
  },

  // Create new book
  create(bookData) {
    const newBook = {
      id: uuidv4,
      ...bookData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    books.push(newBook);
    return newBook;
  },

  // Fully Update Book
  update(id, bookData) {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return null;
    books[index] = {
      ...books[index],
      ...bookData,
      id,
      updatedAt: new Date().toISOString(),
    };
    return books[index];
  },
  // Partially Update
  patch(id, partialData) {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return null;
    books[index] = {
      ...books[index],
      ...partialData,
      id,
      updatedAt: new Date().toISOString(),
    };
    return books[index];
  },

  // Delete by id
  delete(id) {
    const index = books.findIndex((book) => book.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  },
};

module.exports = BookModel;
