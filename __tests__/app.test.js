const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/topics", () => {
  test("GET: 200 Get all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("Invalid path", () => {
  test("GET: 404 When given in invalid path", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path doesn't exist");
      });
  });
});

describe("/api", () => {
  test("Provide a description of all the endpoints available", () => {
    const allEndpoints = endpoints;

    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(allEndpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(typeof article.author).toBe("string");
        expect(typeof article.title).toBe("string");
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.body).toBe("string");
        expect(typeof article.topic).toBe("string");
        expect(typeof article.created_at).toBe("string");
        expect(typeof article.votes).toBe("number");
        expect(typeof article.article_img_url).toBe("string");

        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET: 404 an error message is sent to the client when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("GET: 400 an error message is sent to the client when given an invalid id", () => {
    return request(app)
      .get("/api/articles/orange")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id type");
      });
  });
  test("PATCH: 200 increments the vote property of an article (using the id) and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 1,
        });
      });
  });
  test("PATCH: 200 decrements the vote property of an article (using the id) and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: -100,
        });
      });
  });
  test("PATCH: 404 error message is sent when given a non-existent id", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 100 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
  test("PATCH: 400 error message is sent when given a malformed body", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH: 400 error message is sent when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/not_an_id")
      .send({ inc_votes: 100 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id type");
      });
  });
});

describe("/api/articles", () => {
  test("GET: 200 responds with an articles array of article objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBe(undefined);

          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 responds with an array of comments for the given article_id with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment.article_id).toBe(1);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
        });

        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET: 404 responds with an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("GET: 400 responds with an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id type");
      });
  });
  test("GET: 200 responds with an empty array when the article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("POST: 201 insert a new comment to the given article id and responds with an object of the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "rogersop", body: "This article was brilliant." })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.hasOwnProperty("body")).toBe(true);
        expect(comment.hasOwnProperty("votes")).toBe(true);
        expect(comment.hasOwnProperty("author")).toBe(true);
        expect(comment.hasOwnProperty("article_id")).toBe(true);
        expect(comment.hasOwnProperty("created_at")).toBe(true);

        expect(comment.username === "rogersop");
        expect(comment.body === "This article was brilliant.");
      });
  });
  test("POST: 400 responds with an error message when given a malformed body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "rogersop" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("POST: 400 responds with an error message when given an invalid id", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id type");
      });
  });
  test("POST: 404 responds with an error message when given a non-existent id", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({ username: "rogersop", body: "This article was brilliant." })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("POST: 404 responds with an error message when given a non-existent username in the body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "unknown", body: "This article was brilliant." })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 deletes a comment by the id and sends no body back", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("DELETE: 400 returns an error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id type");
      });
  });
  test("DELETE: 404 returns an error message when given a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
});
