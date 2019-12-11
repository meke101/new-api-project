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

  describe.only("/articles/:articleId/comments POST", () => {
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

    it("POST 201 - add a comment by article id", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", body: "comment here" })
        .expect(201)
        .then(({ body }) => {
          console.log(body);
          // expect(body.comment.article_id).to.equal(1);
        });
    });
  });

  // describe("/articles/:articleId/comments GET", () => {
  //   it("POST 200 - gets a comment by article id", () => {});
  // });
});
