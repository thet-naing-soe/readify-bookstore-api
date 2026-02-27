const { ValidationError } = require("./errorHandler");

// Book creation validation
const validateBookCreate = (req, res, next) => {
  const { title, authorId, isbn, price } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim().length < 1) {
    errors.push("title is required and must be a non-empty string");
  }

  if (!authorId || typeof authorId !== "string") {
    errors.push("authorId is required");
  }

  if (!isbn || !/^(97[89])-?\d{10}$/.test(isbn.replace(/-/g, ""))) {
    errors.push("isbn is required and must be a valid ISBN-13 format");
  }

  if (price === undefined || isNaN(price) || Number(price) < 0) {
    errors.push("price is required and must be a non-negative number");
  }

  if (errors.length > 0) {
    return next(new ValidationError(errors.join("; ")));
  }

  next();
};

// Book update validation (PUT - all fields required)
const validateBookUpdate = (req, res, next) => {
  validateBookCreate(req, res, next);
};

// Book patch validation (PATCH - at least one field)
const validateBookPatch = (req, res, next) => {
  const allowedFields = [
    "title",
    "authorId",
    "isbn",
    "genre",
    "publishedYear",
    "price",
    "stock",
  ];
  const providedFields = Object.keys(req.body);

  if (providedFields.length === 0) {
    return next(
      new ValidationError("At least one field must be provided for update"),
    );
  }

  const invalidFields = providedFields.filter(
    (f) => !allowedFields.includes(f),
  );
  if (invalidFields.length > 0) {
    return next(
      new ValidationError(`Invalid fields: ${invalidFields.join(", ")}`),
    );
  }

  next();
};

module.exports = { validateBookCreate, validateBookUpdate, validateBookPatch };
