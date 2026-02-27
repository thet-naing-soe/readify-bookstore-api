const express = require("express");
const router = express.Router();
const AuthorController = require("../controllers/authorController");

router.get("/", AuthorController.getAllAuthors);
router.get("/:id", AuthorController.getAuthorById);
router.post("/", AuthorController.createAuthor);

module.exports = router;
