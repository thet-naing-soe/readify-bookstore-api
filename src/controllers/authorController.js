const AuthorModel = require("../models/authorModel");
const BookModel = require("../models/bookModel");
const logger = require("../middleware/logger");
const { NotFoundError } = require("../middleware/errorHandler");

const AuthorController = {
  // GET /authors
  getAllAuthors(req, res, next) {
    try {
      const authors = AuthorModel.findAll();
      logger.info(`GET /authors - returned ${authors.length} authors`);

      res.status(200).json({
        success: true,
        data: authors,
        total: authors.length,
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /authors/:id
  getAuthorById(req, res, next) {
    try {
      const author = AuthorModel.findById(req.params.id);
      if (!author) {
        throw new NotFoundError(`Author with id '${req.params.id}'`);
      }

      const authorBooks = BookModel.findAll().filter(
        (b) => b.authorId === req.params.id,
      );

      res.status(200).json({
        success: true,
        data: {
          ...author,
          books: authorBooks,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /authors
  createAuthor(req, res, next) {
    try {
      const { name, nationality, birthYear, bio } = req.body;

      if (!name || name.trim().length < 1) {
        return res.status(400).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "name is required" },
        });
      }

      const newAuthor = AuthorModel.create({
        name: name.trim(),
        nationality: nationality || "Unknown",
        birthYear: birthYear || null,
        bio: bio || "",
      });

      logger.info(`POST /authors - created author id: ${newAuthor.id}`);

      res.status(201).json({
        success: true,
        message: "Author created successfully",
        data: newAuthor,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthorController;
