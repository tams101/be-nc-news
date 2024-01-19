const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
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
  test("POST: 201 adds a new topic", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "tea",
        description: "all things tea",
      })
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic).toEqual({
          slug: "tea",
          description: "all things tea",
        });
      });
  });
  test("POST: 400 an error message is sent when given a malformed body - missing slug", () => {
    return request(app)
      .post("/api/topics")
      .send({ description: "all things tea" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("POST: 400 an error message is sent when given a malformed body - missing description", () => {
    return request(app)
      .post("/api/topics")
      .send({ slug: "all things tea" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("description is required");
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
        expect(typeof article.comment_count).toBe("number");

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
        expect(article.comment_count).toBe(11);
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
        expect(body.msg).toBe("bad request");
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
        expect(body.msg).toBe("bad request");
      });
  });
  test("DELETE: 204 delete an article by id", () => {
    return request(app).delete('/api/articles/5')
    .expect(204)
  });
  test("DELETE: 404 error message when id does not exist", () => {
    return request(app).delete('/api/articles/9999')
    .expect(404).then(({body}) => {
      expect(body.msg).toBe('article does not exist')
    })
  });
  test("DELETE: 400 error message when invalid id given", () => {
    return request(app).delete('/api/articles/not-an-id')
    .expect(400).then(({body}) => {
      expect(body.msg).toBe('bad request')
    })
  })
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
  test("GET: 200 responds with an articles array of article objects sorted by date in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("GET: 200 Filter articles by topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article.topic === "mitch");
        });
      });
  });
  test("GET: 200 return empty array when given a valid topic but there are no articles for that topic", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("GET: 404 error message is sent when given a non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=not_a_topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("topic not found");
      });
  });
  test("GET: 200 responds with an articles array of article objects sorted by article_id - default desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("GET: 200 responds with an articles array of article objects sorted by topic - default desc order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("GET: 200 responds with an articles array of article objects sorted by article_id - asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("article_id", { ascending: true });
      });
  });
  test("GET: 200 responds with an articles array of article objects sorted by topic - asc order", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
        expect(articles).toBeSortedBy("topic", { ascending: true });
      });
  });
  test("GET: 400 when given a sort by query that doesn't exist", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid sort_by query");
      });
  });
  test("GET: 400 when given an order query that doesn't exist", () => {
    return request(app)
      .get("/api/articles/?order=banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid order query");
      });
  });
  test("GET: 200 return articles by a given author", () => {
    return request(app)
      .get("/api/articles?author=butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(4);
        articles.forEach((article) => {
          expect(article.author === "butter_bridge");
        });
      });
  });
  test("GET: 200 returns empty array when given a valid author but there are no articles by that author", () => {
    return request(app)
      .get("/api/articles?author=lurker")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toEqual([]);
      });
  });
  test("GET: 404 error message is sent when given an author that doesn't exist", () => {
    return request(app)
      .get("/api/articles?author=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("author not found");
      });
  });
  test("POST: 201 returns the added article", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "rogersop",
        title: "The Mitch",
        body: "The wonders of mitch",
        topic: "mitch",
        article_img_url: "https://www.mitch.com/mitch",
      })
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article.author).toBe("rogersop");
        expect(article.title).toBe("The Mitch");
        expect(article.body).toBe("The wonders of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.article_img_url).toBe("https://www.mitch.com/mitch");
        expect(article.votes).toBe(0);
        expect(article.article_id).toBe(14);
        expect(article.comment_count).toBe(0);
        expect(article.hasOwnProperty("created_at")).toBe(true);
      });
  });
  test("POST: 201 returns the added article (when article_img_url not provided returns default value)", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "rogersop",
        title: "The Mitch",
        body: "The wonders of mitch",
        topic: "mitch",
      })
      .expect(201)
      .then(({ body }) => {
        const { article } = body;
        expect(article.author).toBe("rogersop");
        expect(article.title).toBe("The Mitch");
        expect(article.body).toBe("The wonders of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.article_img_url).toBe(
          "https://www.example.com/default_img"
        );
        expect(article.votes).toBe(0);
        expect(article.article_id).toBe(14);
        expect(article.comment_count).toBe(0);
        expect(article.hasOwnProperty("created_at")).toBe(true);
      });
  });
  test("POST: 400 returns an error message when missing required fields", () => {
    return request(app)
      .post("/api/articles")
      .send({
        author: "rogersop",
        title: "The Mitch",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("GET: 200 returns all articles on page 1 (default returns 10 articles)", () => {
    return request(app)
      .get("/api/articles?p=1")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(10);
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
        expect(body.msg).toBe("bad request");
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

        expect(comment.author === "rogersop").toBe(true);
        expect(comment.body === "This article was brilliant.").toBe(true);
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
        expect(body.msg).toBe("bad request");
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
        expect(body.msg).toBe("bad request");
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
  test("PATCH: 200 increment the votes on a comment given the comment_id", () => {
    return request(app)
      .patch("/api/comments/6")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toEqual({
          comment_id: 6,
          body: "I hate streaming eyes even more",
          votes: 1,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-04-11T21:02:00.000Z",
        });
      });
  });
  test("PATCH: 200 decrement the votes on a comment given the comment_id", () => {
    return request(app)
      .patch("/api/comments/7")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toEqual({
          comment_id: 7,
          body: "Lobster pot",
          votes: -100,
          author: "icellusedkars",
          article_id: 1,
          created_at: "2020-05-15T20:19:00.000Z",
        });
      });
  });
  test("PATCH: 400 error message is sent when given a malformed body", () => {
    return request(app)
      .patch("/api/comments/6")
      .send({ inc_votes: "one" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("PATCH: 404 error message is sent when given a non-existent comment id", () => {
    return request(app)
      .patch("/api/comments/99999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment_id not found");
      });
  });
  test("PATCH: 400 error message is sent when given an invalid comment id", () => {
    return request(app)
      .patch("/api/comments/not-an-id")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET /api/users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);

        users.forEach((user) => {
          expect(typeof user.username === "string");
          expect(typeof user.name === "string");
          expect(typeof user.avatar_url === "string");
        });
      });
  });
});

describe("/api/users/:username", () => {
  test("GET: 200 returns a user object for the given username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(Object.keys(user).length).toBe(3);
        expect(user).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("GET: 404 returns an error message when the user doesn't exist", () => {
    return request(app)
      .get("/api/users/johnsmith")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user doesn't exist");
      });
  });
});
