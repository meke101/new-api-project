process.env.NODE_ENV = "test";
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("sams-chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");

chai.use(chaiSorted);

const app = require("../app");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe("/topics GET", () => {
    it("GET 200 - returns all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(response => {
          expect(response.body).to.be.an("object");
          expect(response.body.topics).to.be.an("array");
          expect(response.body.topics[0]).to.have.keys(["slug", "description"]);
        });
    });
  });

  describe("/users/:username GET", () => {
    it("GET 200 - returns given user", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(user => {
          expect(user.body.user).to.be.an("object");
          expect(user.body.user).to.have.keys([
            "username",
            "avatar_url",
            "name"
          ]);
        });
    });

    it("GET 404 - a not-found", () => {
      return request(app)
        .get("/api/users/nonExistant")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("User does not exist");
        });
    });
  });

  describe("/articles/:articleId GET", () => {
    it("GET 200 - returns an article from given id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.include.keys([
            "title",
            "article_id",
            "created_at",
            "votes",
            "comment_count"
          ]);
          expect(body.article.comment_count).to.equal("13");
        });
    });

    it('"GET 404 - article not found', () => {
      return request(app)
        .get("/api/articles/1111")
        .expect(404)
        .then(({ body }) => expect(body.msg).to.equal("Not found"));
    });

    it('"GET 400 bad request', () => {
      return request(app)
        .get("/api/articles/turtle")
        .expect(400)
        .then(({ body }) => expect(body.msg).to.equal("Bad request"));
    });
  });

  describe("/articles/:articleId PATCH", () => {
    it("PATCH 200 - updates an article by id", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 200 })
        .expect(200)
        .then(({ body }) => {
          expect(body.article.votes).to.equal(300);

          expect(body.article).to.include.keys([
            "title",
            "article_id",
            "created_at",
            "votes"
          ]);
        });
    });

    it("PATCH 200 no increment", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.include.keys([
            "title",
            "article_id",
            "created_at",
            "votes"
          ]);
        });
    });

    it("PATCH 400 invalid increment", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "turtle" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });

    it("PATCH 200 foreign property on request", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ name: "Tony" })
        .expect(200)
        .then(({ body }) => {
          expect(body.article).to.be.an("object");
          expect(body.article).to.include.keys([
            "title",
            "article_id",
            "created_at",
            "votes"
          ]);
        });
    });
  });

  describe("/articles/:articleId/comments POST", () => {
    it("POST 201 - add a comment by article id", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "comment here" })
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).to.have.keys([
            "comment_id",
            "author",
            "article_id",
            "votes",
            "created_at",
            "body"
          ]);
          expect(body.comment.article_id).to.equal(1);
        });
    });

    it("POST 400 - no username on request body", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ body: "comment here" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });

    it("POST 404 - username does not exist", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "Not_a_User", body: "comment here" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });

    it("POST 404 - param is a non-existant article", () => {
      return request(app)
        .post("/api/articles/9999/comments")
        .send({ username: "butter_bridge", body: "comment here" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not Found");
        });
    });

    it("POST 400 - param is non-existant and bad form", () => {
      return request(app)
        .post("/api/articles/wrongForm/comments")
        .send({ username: "butter_bridge", body: "comment here" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });

    it("POST 400 - request includes a foreign property", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge",
          body: "comment here",
          colour: "blue"
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Insert Request");
        });
    });
  });

  describe("GET /articles/:articleId/comments ", () => {
    it("GET 200 - gets a comment by article ID", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.equal(13);
          expect(body.comments).to.be.an("array");
          expect(body.comments[0]).to.include.keys([
            "comment_id",
            "votes",
            "created_at",
            "author",
            "body"
          ]);
        });
    });

    it("GET 400 bad request", () => {
      return request(app)
        .get("/api/articles/notANum/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad request");
        });
    });

    it("GET 404 non-existant article", () => {
      return request(app)
        .get("/api/articles/99999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Article not found");
        });
    });

    it("GET 200 no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
          expect(body.comments).to.eql([]);
        });
    });

    it("GET:200, sort author ascending", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).ascendingBy("author");
        });
    });

    it("GET:400, invalid query ", () => {
      return request(app)
        .get("/api/articles/5/comments?sort_by=notAColumn")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Insert Request");
        });
    });
  });

  describe("GET /articles", () => {
    it("GET 200 - gets all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(12);
          expect(body.articles[0]).to.contain.keys(
            "article_id",
            "title",
            "votes",
            "author",
            "topic",
            "created_at",
            "comment_count"
          );
        });
    });

    it("GET 200 - sorts the articles asc by its default (created_at)", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(12);
          expect(body.articles).ascendingBy("created_at");
        });
    });

    it("GET 200 - sorts the articles by topic, asc", () => {
      return request(app)
        .get("/api/articles?sort_by=topic&order=asc")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(12);
          expect(body.articles).ascendingBy("topic");
        });
    });

    it("GET:400, bad request for invalid column", () => {
      return request(app)
        .get("/api/articles/?sort_by=notAColumn")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).to.equal("Bad Insert Request");
        });
    });

    it("GET 200 - filters by author", () => {
      return request(app)
        .get("/api/articles?author=rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(3);
          expect(body.articles[0].author).to.eql("rogersop");
        });
    });

    it("GET 200 - filters by topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(1);
          expect(body.articles[0].topic).to.eql("cats");
        });
    });

    it("GET 200 - filters by author and topic", () => {
      return request(app)
        .get("/api/articles?author=rogersop&topic=mitch")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles.length).to.equal(2);
          expect(body.articles[0].author).to.eql("rogersop");
          expect(body.articles[0].topic).to.eql("mitch");
        });
    });

    it("GET 404 - filter by notAnAuthor", () => {
      return request(app)
        .get("/api/articles?author=notAnAuthor")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not found");
        });
    });

    it("GET 404 - filter by notATopic", () => {
      return request(app)
        .get("/api/articles?topic=notATopic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Not found");
        });
    });
    it("GET 404 - method not found", () => {
      return request(app)
        .get("/cheese")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found");
        });
    });

    it("PATCH 405 - method not allowed", () => {
      return request(app)
        .patch("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).to.equal("Method not allowed");
        });
    });
  });

  describe("PATCH /api/comments/:comment_id", () => {
    it("202 patches comment by changing vote", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: 10 })
        .expect(200)

        .then(({ body }) => {
          expect(body.comment.votes).to.equal(26);
          expect(body.comment).to.include.keys([
            "comment_id",
            "author",
            "article_id",
            "created_at",
            "votes",
            "body"
          ]);
        });
    });

    it("404 comment not found but valid input", () => {
      return request(app)
        .patch("/api/comments/999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => expect(body.msg).to.equal("Not Found"));
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    it("204 deletes comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204);
    });
  });

  describe("DELETE /api/comments/:comment_id", () => {
    it("404 comment does not exist", () => {
      return request(app)
        .delete("/api/comments/10000")
        .expect(404);
    });
  });
});
