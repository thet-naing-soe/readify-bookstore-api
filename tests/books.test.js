const request = require("supertest");
const app = require("../src/app");

describe("Books API Endpoints", () => {
  let createdBookId;

  // ---- GET /books ----
  describe("GET /api/v1/books", () => {
    it("should return 200 with books array", async () => {
      const res = await request(app).get("/api/v1/books");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toBeDefined();
    });

    it("should support genre filtering", async () => {
      const res = await request(app).get("/api/v1/books?genre=Technology");

      expect(res.status).toBe(200);
      res.body.data.forEach((book) => {
        expect(book.genre).toBe("Technology");
      });
    });
  });

  // ---- POST /books ----
  describe("POST /api/v1/books", () => {
    it("should create book and return 201", async () => {
      const newBook = {
        title: "Jest Test Book",
        authorId: "1",
        isbn: "9789999999991",
        genre: "Technology",
        price: 25.0,
        stock: 10,
      };

      const res = await request(app).post("/api/v1/books").send(newBook);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Jest Test Book");
      expect(res.body.data.id).toBeDefined();

      createdBookId = res.body.data.id;
    });

    it("should return 400 for missing title", async () => {
      const res = await request(app)
        .post("/api/v1/books")
        .send({ price: 10.0, isbn: "9789999999992", authorId: "1" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("should return 400 for invalid ISBN", async () => {
      const res = await request(app).post("/api/v1/books").send({
        title: "Test",
        authorId: "1",
        isbn: "BADISBN",
        price: 10.0,
      });

      expect(res.status).toBe(400);
    });

    it("should return 409 for duplicate ISBN", async () => {
      const res = await request(app).post("/api/v1/books").send({
        title: "Duplicate Book",
        authorId: "1",
        isbn: "9789999999991",
        price: 15.0,
      });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });
  });

  // ---- GET /books/:id ----
  describe("GET /api/v1/books/:id", () => {
    it("should return book with author info", async () => {
      const res = await request(app).get(`/api/v1/books/${createdBookId}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdBookId);
      expect(res.body.data.author).toBeDefined();
    });

    it("should return 404 for non-existent book", async () => {
      const res = await request(app).get("/api/v1/books/nonexistent-id-12345");

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  // ---- DELETE /books/:id ----
  describe("DELETE /api/v1/books/:id", () => {
    it("should delete book and return 204", async () => {
      const res = await request(app).delete(`/api/v1/books/${createdBookId}`);
      expect(res.status).toBe(204);
    });

    it("should return 404 after deletion", async () => {
      const res = await request(app).get(`/api/v1/books/${createdBookId}`);
      expect(res.status).toBe(404);
    });
  });

  // ---- Health Check ----
  describe("GET /health", () => {
    it("should return healthy status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
    });
  });
});
