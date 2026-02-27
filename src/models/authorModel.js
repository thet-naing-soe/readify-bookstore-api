const { v4: uuidv4 } = require("uuid");

let authors = [
  {
    id: "1",
    name: "F. Scott Fitzgerald",
    nationality: "American",
    birthYear: 1896,
    bio: "American novelist and short story writer.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Robert C. Martin",
    nationality: "American",
    birthYear: 1952,
    bio: "Software engineer and author known as Uncle Bob.",
    createdAt: new Date().toISOString(),
  },
];

const AuthorModel = {
  findAll() {
    return authors;
  },

  findById(id) {
    return authors.find((author) => author.id === id) || null;
  },

  create(authorData) {
    const newAuthor = {
      id: uuidv4(),
      ...authorData,
      createdAt: new Date().toISOString(),
    };
    authors.push(newAuthor);
    return newAuthor;
  },

  update(id, authorData) {
    const index = authors.findIndex((a) => a.id === id);
    if (index === -1) return null;
    authors[index] = { ...authors[index], ...authorData, id };
    return authors[index];
  },

  delete(id) {
    const index = authors.findIndex((a) => a.id === id);
    if (index === -1) return false;
    authors.splice(index, 1);
    return true;
  },
};

module.exports = AuthorModel;
