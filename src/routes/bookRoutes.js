const express = require("express");
const router = express.Router();
const BookController = require("../controllers/bookController");
const {
  validateBookCreate,
  validateBookUpdate,
  validateBookPatch,
} = require("../middleware/validator");

router.get("/", BookController.getAllBooks);
router.post("/", validateBookCreate, BookController.createBook);
router.get("/:id", BookController.getBookById);
router.put("/:id", validateBookUpdate, BookController.updateBook);
router.patch("/:id", validateBookPatch, BookController.patchBook);
router.delete("/:id", BookController.deleteBook);

module.exports = router;
