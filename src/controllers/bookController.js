const BookModel = require("../models/bookModel");
const AuthorModel = require("../models/authorModel");
const logger = require("../middleware/logger");
const { NotFoundError, ConflictError } = require("../middleware/errorHandler");

const BookController = {
  getAllBooks(req, res, next) {
    try {
      const { genre, authorId, page = 1, limit = 10 } = req.query;
      let books = BookModel.findAll();

      if (genre) {
        books = books.filter(
          (book) => book.genre.toLowerCase() === genre.toLowerCase(),
        );
      }
      if (authorId) {
        books = books.filter((book) => book.authorId === authorId);
      }

      const startIndex = (Number(page) - 1) * Number(limit);
      const paginatedBooks = books.slice(
        startIndex,
        startIndex + Number(limit),
      );

      logger.info(`GET /books - returned ${paginatedBooks.length} books`);

      res.status(200).json({
        success: true,
        data: paginatedBooks,
        pagination: {
          total: books.length,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(books.length / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getBookById(req, res, next) {
    try {
      const book = BookModel.findById(req.params.id);
      if (!book) {
        throw new NotFoundError(`Book with id '${req.params.id}'`);
      }

      const author = AuthorModel.findById(book.authorId);
      logger.info(`GET /books/${req.params.id} - book found`);

      res.status(200).json({
        success: true,
        data: {
          ...book,
          author: author || null,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  createBook(req, res, next) {
    try {
      const { title, authorId, isbn, genre, publishedYear, price, stock } =
        req.body;

      // Author existence check
      const author = AuthorModel.findById(authorId);
      if (!author) {
        throw new NotFoundError(`Author with id '${authorId}'`);
      }

      const existingBook = BookModel.findByIsbn(isbn);
      if (existingBook) {
        throw new ConflictError(`Book with ISBN '${isbn}' already exists`);
      }

      const newBook = BookModel.create({
        title: title.trim(),
        authorId,
        isbn,
        genre: genre || "General",
        publishedYear: publishedYear || null,
        price: Number(price),
        stock: stock || 0,
      });

      logger.info(`POST /books - created book id: ${newBook.id}`);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: newBook,
      });
    } catch (err) {
      next(err);
    }
  },

  updateBook(req, res, next) {
    try {
      const book = BookModel.findById(req.params.id);
      if (!book) {
        throw new NotFoundError(`Book with id '${req.params.id}'`);
      }

      const author = AuthorModel.findById(req.body.authorId);
      if (!author) {
        throw new NotFoundError(`Author with id '${req.body.authorId}'`);
      }

      const updatedBook = BookModel.update(req.params.id, {
        title: req.body.title.trim(),
        authorId: req.body.authorId,
        isbn: req.body.isbn,
        genre: req.body.genre || "General",
        publishedYear: req.body.publishedYear || null,
        price: Number(req.body.price),
        stock: req.body.stock || 0,
      });

      logger.info(`PUT /books/${req.params.id} - book updated`);

      res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (err) {
      next(err);
    }
  },

  patchBook(req, res, next) {
    try {
      const book = BookModel.findById(req.params.id);
      if (!book) {
        throw new NotFoundError(`Book with id '${req.params.id}'`);
      }

      const updatedBook = BookModel.patch(req.params.id, req.body);
      logger.info(`PATCH /books/${req.params.id} - book partially updated`);

      res.status(200).json({
        success: true,
        message: "Book partially updated successfully",
        data: updatedBook,
      });
    } catch (err) {
      next(err);
    }
  },

  deleteBook(req, res, next) {
    try {
      const book = BookModel.findById(req.params.id);
      if (!book) {
        throw new NotFoundError(`Book with id '${req.params.id}'`);
      }

      BookModel.delete(req.params.id);
      logger.info(`DELETE /books/${req.params.id} - book deleted`);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = BookController;
