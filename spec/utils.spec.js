const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("does not mutate origional", () => {
    const input = [{ created_at: 1471522072389 }];
    formatDates(input);
    expect(input).to.eql([{ created_at: 1471522072389 }]);
  });

  it("takes empty array and returns empty array", () => {
    const input = [];
    const expected = [];
    expect(formatDates(input)).to.eql(expected);
  });

  it("takes array with one object and converts to js date", () => {
    const input = [{ created_at: 1471522072389 }];
    const date = new Date(1471522072389);
    const expected = [{ created_at: date }];
    expect(formatDates(input)).to.eql(expected);
  });

  it("takes array with many object including timestamp, converts these to js dates", () => {
    const input = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is pronment.",
        created_at: 1471522072389
      },
      {
        title: "The Rise Of Thinking Machines:",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many peopto use solving a whole new range of problems around the world.",
        created_at: 1500584273256
      },
      {
        title: "22 Amazing open source React projects",
        topic: "coding",
        author: "happyamy2016",
        body: "This is a col stars from the 22 projects was 1,681.",
        created_at: 1500659650346
      }
    ];
    const expected = [
      {
        title: "Running a Node App",
        topic: "coding",
        author: "jessjelly",
        body: "This is pronment.",
        created_at: new Date(1471522072389)
      },
      {
        title: "The Rise Of Thinking Machines:",
        topic: "coding",
        author: "jessjelly",
        body:
          "Many peopto use solving a whole new range of problems around the world.",
        created_at: new Date(1500584273256)
      },
      {
        title: "22 Amazing open source React projects",
        topic: "coding",
        author: "happyamy2016",
        body: "This is a col stars from the 22 projects was 1,681.",
        created_at: new Date(1500659650346)
      }
    ];
    expect(formatDates(input)).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("takes array, returns obj", () => {
    const input = [];
    expect(makeRefObj(input)).to.be.an("object");
  });

  it("takes array with one object, returns reference obj", () => {
    const input = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(input)).to.eql({ A: 1 });
  });

  it("does not mutate origional", () => {
    const input = [{ article_id: 1, title: "A" }];
    makeRefObj(input);
    expect(input).to.eql([{ article_id: 1, title: "A" }]);
  });

  it("takes array with one object, returns reference obj", () => {
    const input = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" }
    ];
    expect(makeRefObj(input)).to.eql({ A: 1, B: 2, C: 3 });
  });

  it("takes array with one object, returns reference obj", () => {
    const input = [
      {
        article_id: 1,
        title: "Living",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      },
      {
        article_id: 2,
        title: "Eight",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171
      },
      {
        article_id: 3,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171
      }
    ];
    expect(makeRefObj(input)).to.eql({
      Living: 1,
      Eight: 2,
      "Student SUES Mitch!": 3
    });
  });
});

describe("formatComments", () => {
  it("takes array, returns new array", () => {
    const input = [];
    expect(formatComments(input)).to.be.an("array");
    expect(formatComments(input)).to.not.equal(input);
  });

  xit("takes array of one comment and ref obj, returns comment with id from reference ", () => {
    const input = [
      {
        body: "The ...",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        title: "A"
      }
    ];
    const reference = { A: 1 };
    const expectedResult = [
      {
        body: "The ...",
        article_id: "Living in the shadow of a great man",
        author: "butter_bridge",
        article_id: 1
      }
    ];

    expect(formatComments(input, reference)).to.eql(expectedResult);
  });

  it("takes array of one comment and ref obj, returns comment with id from reference ", () => {
    const input = [
      {
        body: "The ...",
        belongs_to: "A",
        created_by: "butter_bridge",

        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "The ...",
        belongs_to: "B",
        created_by: "butter_bridge",

        votes: 16,
        created_at: 1511354163389
      },
      {
        body: "The ...",
        belongs_to: "C",
        created_by: "butter_bridge",

        votes: 16,
        created_at: 1511354163389
      }
    ];
    const reference = { A: 1, B: 2, C: 3 };
    const expectedResult = [
      {
        body: "The ...",

        author: "butter_bridge",
        article_id: 1,
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body: "The ...",

        author: "butter_bridge",
        article_id: 2,
        votes: 16,
        created_at: new Date(1511354163389)
      },
      {
        body: "The ...",

        author: "butter_bridge",
        article_id: 3,
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];

    expect(formatComments(input, reference)).to.eql(expectedResult);
  });
});
