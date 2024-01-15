const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const fs = require("fs/promises");
const endpoints = require('../endpoints.json')

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

        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });

        expect(topics).toHaveLength(3);
      });
  });
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
    const allEndpoints = endpoints

    return request(app).get('/api').then(({body}) => {
      expect(body.endpoints).toEqual(allEndpoints)
    })
    
  });
});
