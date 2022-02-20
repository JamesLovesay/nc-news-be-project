const request = require("supertest");
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index.js')

beforeEach(() => seed(data))
afterAll(() => db.end());

describe('app - global', () => {
        test('status: 404, responds with "Path not found" if incorrect path is provided', () => {
            return request(app)
            .get('/api/not an endpoint')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("404 - Path not found");
            })
        })

    describe('GET - api/topics', () => {
        test('status: 200, responds with array of topics with slug and description properties', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body: {topics}}) => {
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    )
                })
            })
        })
    })

    
    describe('GET - api/articles/:article_id', () => {
        test('status: 200, responds with correct article object on valid request', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(
                    expect.objectContaining({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 100,
                  }))
            })
        })
        test('status: 404, responds with error of "article not found" if user selects endpoint with valid path but it does not exist', () => {
            return request(app)
            .get('/api/articles/45100')
            .expect(404)
            .then(({body: { msg }}) => {
               expect(msg).toBe("article not found"); 
            })
        })

        test('status: 400, responds with error of "bad request" if user selects endpoint with invalid path', () => {
            return request(app)
            .get('/api/articles/not-an-id')
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request"); 
            })
        })
        test('status: 200, responds with the correct object and has a property of comment count if passed a valid endpoint', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(
                    expect.objectContaining({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: expect.any(String),
                    votes: 100,
                    comment_count: 11
                }))
            })
        })
    })

    describe('PATCH - /api/articles/:article_id', () => {
        test('test that patch request returns updated body when passed a valid request', () => {
            const updateToArticle = {inc_votes: 1}
            return request(app)
            .patch('/api/articles/1')
            .send(updateToArticle)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 101,
                  })
            })
        })
        test('test that patch request returns updated body when passed a valid request with a negative number', () => {
            const updateToArticle = {inc_votes: -1}
            return request(app)
            .patch('/api/articles/1')
            .send(updateToArticle)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 99,
                  })
            })
        })
        test('status: 404, test that patch request returns 404 when passed an article that does not exist', () => {
            const updateToArticle = {inc_votes: 1}
            return request(app)
            .patch('/api/articles/985')
            .send(updateToArticle)
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("article not found"); 
             })
        })
        test('status: 400, responds with error of "bad request" if user selects endpoint with invalid path', () => {
            const updateToArticle = {inc_votes : 1}
            return request(app)
            .patch('/api/articles/not-an-id')
            .send(updateToArticle)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that does not contain an inc_votes property', () => {
            const updateToArticle = {some_irrelevant_property : 1}
            return request(app)
            .patch('/api/articles/1')
            .send(updateToArticle)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that contains an inc_votes property, but the value of that property is not a number', () => {
            const updateToArticle = {inc_votes : "not a number"}
            return request(app)
            .patch('/api/articles/1')
            .send(updateToArticle)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 200, responds with successful status, amends the votes and does not amend other properties on the article if passed additoinal properties', () => {
            const updateToArticle = {inc_votes : -1,
            title: "Not this article's title"
        }
            return request(app)
            .patch('/api/articles/1')
            .send(updateToArticle)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedArticle).toEqual({
                    article_id: 1,
                    title: "Living in the shadow of a great man",
                    topic: "mitch",
                    author: "butter_bridge",
                    body: "I find this existence challenging",
                    created_at: "2020-07-09T20:11:00.000Z",
                    votes: 99,
                })
            })
        })
    })

    describe('GET - /api/users', () => {
        test('status: 200, responds with an array of users containing the property username on receipt of a get request with a valid path', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(body.users).toHaveLength(4)
                body.users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String)
                        })
                    )
                })
            })
        })
    })

    describe('GET - /api/articles', () => {
        test('status: 200, responds with an array of article objects containing the correct properties if passed the correct path', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toHaveLength(12)
                expect(body.articles).toBeSortedBy("created_at", {descending: true});
            })
        })
    })
    
    describe('GET - /api/articles (comment count)', () => {
        test('status 200 - request for an article now includes comment count column as standard', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles).toHaveLength(12)
                articles.forEach((article) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        })
                    )
                })
        })
    })
        test('status 200 - returns correct object and comment count for the most recent article', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles[0]).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: 0,
                    comment_count: 2})
                    })
        })
    })

    describe('GET - /api/articles/:article_id/comments', () => {
        test('status: 200, responds with an array of comment objects for the given article containing the correct properties if passed a valid path', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(11)
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String)
                        })
                    )
                })
            })
        })
        test('status: 404, responds with error of "this article could not be found" if user selects endpoint with valid path but it does not exist', () => {
            return request(app)
            .get('/api/articles/379/comments')
            .expect(404)
            .then(({ body: { msg }}) => {
               expect(msg).toBe("404 - Article not found"); 
            })
        })
        test('status: 400 for invalid article_id', () => {
            return request(app)
            .get('/api/articles/not-a-valid-id/comments')
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request"); 
            })
        })
        test('status: 200, responds with empty array if passed valid article id but there are no comments', () => {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({body: { comments }}) => {
               expect(comments).toEqual([]);
               expect(comments).toHaveLength(0); 
            })
        })
    })

    describe('POST - /api/articles/:article_id/comments', () => {
        test('status: 201, responds with a copy of the posted comment', () => {
            const newComment = {
                username: "butter_bridge",
                body: "some comment"
            }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toEqual({ 
                created_at: expect.any(String),
                comment_id: 19,
                author: "butter_bridge",
                body: "some comment",
                votes: 0,
                article_id: 1
            })
            })
        })
        test('status: 404, test that post request returns 404 when passed an article that does not exist', () => {
            const newComment = {
                username: "butter_bridge",
                body: "some comment"
            }
            return request(app)
            .post('/api/articles/9585/comments')
            .send(newComment)
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("article not found"); 
             })
        })
        test('status: 400, responds with error of "bad request" if user selects endpoint with invalid path', () => {
            const newComment = {
                username: "butter_bridge",
                body: "some comment"
            }
            return request(app)
            .post('/api/articles/not-an-id/comments')
            .send(newComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that does not contain a username and body property', () => {
            const newComment = {
                username: "butter_bridge",
            }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that does not contain a username property', () => {
            const newComment = {
                body: "some comment"
            }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object contains an empty string for body', () => {
            const newComment = {
                username: 'butter_bridge',
                body: ""
            }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 201, responds with correctly posted comment is the user provides an object with a username and body, but also with additional irrelevant properties.', () => {
            const newComment = {
                username: 'butter_bridge',
                body: "some comment",
                some_irrelevant_property: 'some irrelevant key'
            }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toEqual({ 
                created_at: expect.any(String),
                comment_id: 19,
                author: "butter_bridge",
                body: "some comment",
                votes: 0,
                article_id: 1
                })
            })
        })
    })
  
    describe('GET - /api/articles (queries)', () => {
        test('status: 200, responds with correctly sorted array of objects if passed a valid query', () => {
            return request(app)
            .get('/api/articles/?sort_by=title&order=desc')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(12); 
                expect(articles).toBeSortedBy('title', {descending: true})
             })
        })
        test('status: 200, responds with correctly sorted array of objects if passed an alternate query to order by body and to do it in ascending fashion', () => {
            return request(app)
            .get('/api/articles/?sort_by=body&order=asc')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(12); 
                expect(articles).toBeSortedBy('body')
             })
        })
        test('status: 200, responds with correctly sorted array of objects if passed query to sort by author column', () => {
            return request(app)
            .get('/api/articles/?sort_by=author&order=asc')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(12); 
                expect(articles).toBeSortedBy('author')
             })
        })
        test('status: 200, responds with correctly sorted array of objects if passed query to sort by topic column in descending order', () => {
            return request(app)
            .get('/api/articles/?sort_by=topic&order=DESC')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(12); 
                expect(articles).toBeSortedBy('topic', {descending: true})
             })
        })
        test('status: 200, responds with correctly sorted array of objects if passed query to sort by created_at column in ascending order', () => {
            return request(app)
            .get('/api/articles/?sort_by=created_at&order=ASC')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(12); 
                expect(articles).toBeSortedBy('created_at')
             })
        })
        test('status: 200, responds with correctly sorted array of objects if passed query to sort by votes column in descending order', () => {
            return request(app)
            .get('/api/articles/?sort_by=votes&order=desc')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(12); 
                expect(articles).toBeSortedBy('votes', {descending: true})
             })
        })
        test('status: 200, responds with correctly filtered array of objects if passed a topic query of cats', () => {
            return request(app)
            .get('/api/articles/?topic=cats')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(1); 
                expect(articles[0]).toEqual({title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                article_id: 5,
                author: "rogersop",
                body: "Bastet walks amongst us, and the cats are taking arms!",
                created_at: expect.any(String),
                votes: 0,
                comment_count: 2
                })
             })
        })
        test('status: 400, responds with bad request when user tries to sort by a column that does not exist', () => {
            return request(app)
            .get('/api/articles/?sort_by=columnThatDoesNotExist')
            .expect(400)
            .then(({body: { msg }}) => {
                expect(msg).toBe("Invalid sort query"); 
            })
        })
        test('status: 400, responds with bad request when user tries to sort by something othere than asc or desc', () => {
            return request(app)
            .get('/api/articles/?order=NotASCorDESC')
            .expect(400)
            .then(({body: { msg }}) => {
                expect(msg).toBe("Invalid sort query"); 
            })
        })
        test('status: 404, responds with topic not found when user tries to filter by a topic that does not exist', () => {
            return request(app)
            .get('/api/articles/?topic=TopicDoesNotExist')
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("404 - topic not found"); 
            })
        })
        test('status: 200, responds with empty array user tries to filter by a topic that exists, but there are no articles on that topic', () => {
            return request(app)
            .get('/api/articles/?topic=paper')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toEqual([]);
                expect(articles).toHaveLength(0);  
            })
        })
        test('status: 200, responds with correctly sorted array of objects if passed a valid query alongside an order of descending and a topic filter', () => {
            return request(app)
            .get('/api/articles/?sort_by=body&order=desc&topic=mitch')
            .expect(200)
            .then(({body: { articles }}) => {
                expect(articles).toHaveLength(11); 
                expect(articles).toBeSortedBy('body', {descending: true})
             })
        })
    })
      
    describe('GET - /api', () => {
        test('status 200: responds with the JSON object setting out the endpoints available on the api', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({ body: { object }}) => {
                expect(object).toEqual({
                    "GET /api": {
                      "description": "serves up a json representation of all the available endpoints of the api"
                    },
                    "GET /api/topics": {
                      "description": "serves an array of all topics",
                      "queries": [],
                      "exampleResponse": {
                        "topics": [{ "slug": "football", "description": "Footie!" }]
                      }
                    },
                    "GET /api/articles": {
                      "description": "serves an array of all topics which can be sorted by title, topic, author, body, created_at or comment count, either in ascending or descending order, and can be filtered by the topics mitch, paper or cats",
                      "queries": ["author", "topic", "sort_by", "order"],
                      "exampleResponse": {
                        "articles": [
                          {
                            "title": "Seafood substitutions are increasing",
                            "topic": "cooking",
                            "author": "weegembump",
                            "body": "Text from the article..",
                            "created_at": 1527695953341, 
                            "comment_count": 4
                          }
                        ]
                      }
                    },
                    "GET /api/articles/:article_id": {
                      "description": "serves up an object containing the details of the article requested by the user",
                      "queries": [],
                      "exampleResponse": {
                        "article_id": 1,
                        "title": "Living in the shadow of a great man",
                        "topic": "mitch",
                        "author": "butter_bridge",
                        "body": "I find this existence challenging",
                        "created_at": 1594329060000,
                        "votes": 100
                      }
                    },
                    "PATCH /api/articles/:article_id": {
                      "description": "serves up an object containing the details of the updated article following a request for an amendment to the number of votes for the article by the user",
                      "queries": ["inc_votes"],
                      "exampleResponse": {
                        "updatedArticle": {
                        "article_id": 1,
                        "title": "Living in the shadow of a great man",
                        "topic": "mitch",
                        "author": "butter_bridge",
                        "body": "I find this existence challenging",
                        "created_at": "2020-07-09T20:11:00.000Z",
                        "votes": 101
                        }
                      }
                    }, 
                    "GET /api/users": {
                      "description": "serves up an array of all usernames",
                      "queries": [],
                      "exampleResponse": {
                        "users": [
                          {"username": "butter_bridge"},
                          {"username": "icellusedkars"}
                        ]
                      }
                    },
                    "GET /api/articles/:article_id/comments": {
                      "description": "serves up an array of comments relating to the article id specified by the user",
                      "queries": [],
                      "exampleResponse": {
                        "comments": [
                          {
                          "comment_id": 13,
                          "votes": 0,
                          "created_at": "2020-06-15T10:25:00.000Z",
                          "author": "icellusedkars",
                          "body": "Fruit pastilles"
                          }
                        ]
                      }
                    }, 
                    "POST /api/articles/:article_id/comments": {
                      "description": "serves up an object containing the details of the comment that the user posts to the specified article id",
                      "queries": ["username", "body"],
                      "exampleResponse": {
                        "comment": {
                            "created_at": "2020-06-15T10:25:00.000Z", 
                            "comment_id": 19,
                            "author": "butter_bridge",
                            "body": "comment on the article",
                            "votes": 0,
                            "article_id": 1
                        }
                      }
                    }, 
                    "DELETE /api/comments/:comment_id": {
                      "description": "serves up an empty object confirming that the comment input by the user has been deleted and the content is no longer available",
                      "queries": [],
                      "exampleResponse": {
                        "comment": {}
                      }
                    },
                    "GET /api/users/:username": {
                      "description": "serves up an object containing the details of the user relating to the username that the client provides in the request",
                      "queries": ["username"],
                      "exampleResponse": {
                       "user": {
                        "username": "icellusedkars",
                        "name": "sam",
                        "avatar_url": "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
                       }
                      }
                    },
                    "DELETE /api/articles/:article_id": {
                      "description": "serves up an empty object confirming that the article input by the user has been deleted and the content is no longer available",
                      "queries": [],
                      "exampleResponse": {
                        "article": {}
                      }
                    },
                    "PATCH /api/comments/:comment_id": {
                      "description": "serves up an object containing the details of the updated comment following a request for an amendment to the number of votes for the comment by the user",
                      "queries": ["inc_votes"],
                      "exampleResponse": {
                        "comment": {
                          "comment_id": 1,
                          "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                          "votes": 15,
                          "author": "butter_bridge",
                          "article_id": 9,
                          "created_at": 1586179020000,
                        }
                      }
                    },
                    "POST /api/topics": {
                      "description": "serves up an object containing the details of the topic that the user posts database",
                      "queries": ["slug", "description"],
                      "exampleResponse": {
                        "topic": {
                          "slug": "topic name here",
                          "description": "description here"
                      }
                      }
                    }
                  })
            })
        })
    })

    describe('DELETE - /api/comments/:comment_id', () => {
        test('status: 204, returns successful status and no content when passed a valid comment id, with the number of comments relating to the article it is linked to being reduced by one.', () => {
            return request(app)
            .delete('/api/comments/18')
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
            .then(() => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(10)
            })
            })
        })  
        test('status: 400, bad request if user tries to delete by an id that is invalid.', () => {
            return request(app)
            .delete('/api/comments/not-a-valid-id')
            .expect(400)
            .then(({body: { msg }}) => {
                expect(msg).toBe("bad request"); 
            })
        })  
        test('status: 404, comment not found if passed a valid id but the article does not exist.', () => {
            return request(app)
            .delete('/api/comments/89565')
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("404 - Comment not found"); 
            })
        })  
    })

    describe('GET - /api/users/:username', () => {
        test('status: 200, responds with correct username object on valid request', () => {
            return request(app)
            .get('/api/users/icellusedkars')
            .expect(200)
            .then(({ body }) => {
                expect(body.user).toEqual(
                    expect.objectContaining({
                    username: 'icellusedkars',
                    name: 'sam',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                  }))
            })
        })
        test('status: 404, responds with error of "username not found" if user selects endpoint with valid path but it does not exist', () => {
            return request(app)
            .get('/api/users/not-a-username')
            .expect(404)
            .then(({body: { msg }}) => {
               expect(msg).toBe("username not found"); 
            })
        })
    })

    describe('DELETE - /api/articles/:article_id', () => {
        test('status: 204, returns successful status and no content when passed a valid article id, with the number of articles being reduced by one.', () => {
            return request(app)
            .delete('/api/articles/2')
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({})
            })
            .then(() => {
            return request(app)
            .get('/api/articles/')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(11)
            })
            })
        })  
        test('status: 400, bad request if user tries to delete by an id that is invalid.', () => {
            return request(app)
            .delete('/api/articles/not-a-valid-id')
            .expect(400)
            .then(({body: { msg }}) => {
                expect(msg).toBe("bad request"); 
            })
        })  
        test('status: 404, article not found if passed a valid id but the article does not exist.', () => {
            return request(app)
            .delete('/api/articles/89565')
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("404 - Article not found"); 
            })
        })  
    })

    // describe.only('POST - /api/articles', () => {
    //     test('status: 201, responds with a copy of the posted article', () => {
    //         const newArticle = {
    //             author: "butter_bridge",
    //             body: "article content",
    //             title: "title of the article",
    //             topic: "mitch"
    //         }
    //         return request(app)
    //         .post('/api/articles')
    //         .send(newArticle)
    //         .expect(201)
    //         .then(({ body }) => {
    //             expect(body.article).toEqual({ 
    //             created_at: expect.any(String),
    //             article_id: 13,
    //             author: "butter_bridge",
    //             body: "article content",
    //             title: "title of the article",
    //             topic: "mitch",
    //             votes: 0,
    //             comment_count: 0
    //         })
    //         })
    //     })
    // })

    describe('PATCH - /api/comments/:comment_id', () => {
        test('test that patch request returns updated body when passed a valid request', () => {
            const updateToComment = {inc_votes: 1}
            return request(app)
            .patch('/api/comments/1')
            .send(updateToComment)
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 17,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: expect.any(String)
                  })
            })
        })
        test('test that patch request returns updated body when passed a valid request with a negative number', () => {
            const updateToComment = {inc_votes: -1}
            return request(app)
            .patch('/api/comments/1')
            .send(updateToComment)
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 15,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: expect.any(String)
                  })
            })
        })
        test('status: 404, test that patch request returns 404 when passed an article that does not exist', () => {
            const updateToComment = {inc_votes: 1}
            return request(app)
            .patch('/api/comments/1985')
            .send(updateToComment)
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("comment not found"); 
             })
        })
        test('status: 400, responds with error of "bad request" if user selects endpoint with invalid path', () => {
            const updateToComment = {inc_votes : 1}
            return request(app)
            .patch('/api/comments/not-an-id')
            .send(updateToComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that does not contain an inc_votes property', () => {
            const updateToComment = {some_irrelevant_property : 1}
            return request(app)
            .patch('/api/comments/1')
            .send(updateToComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that contains an inc_votes property, but the value of that property is not a number', () => {
            const updateToComment = {inc_votes : "not a number"}
            return request(app)
            .patch('/api/comments/1')
            .send(updateToComment)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 200, responds with successful status, amends the votes and does not amend other properties on the article if passed additoinal properties', () => {
            const updateToComment = {inc_votes : -1,
            body: "Not this comment's body"
        }
            return request(app)
            .patch('/api/comments/1')
            .send(updateToComment)
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    votes: 15,
                    author: "butter_bridge",
                    article_id: 9,
                    created_at: expect.any(String)
                  })
            })
        })
    })

    describe('POST - /api/topics', () => {
        test('status: 201, responds with a copy of the posted topic', () => {
            const newTopic = {
                slug: "topic name here",
                description: "description here"
              }
            return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(201)
            .then(({ body }) => {
                expect(body.topic).toEqual({
                    slug: "topic name here",
                    description: "description here"
                })
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that does not contain a slug and description property', () => {
            const newTopic = {
                NotSlug: "topic name here",
                NotDescription: "description here"
              }
            return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object contains an empty string for body or slug', () => {
            const newTopic = {
                slug: "",
                description: "description here"
              }
            return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 201, responds with correctly posted comment if the user provides an object with a slug and description, but also with additional irrelevant properties.', () => {
            const newTopic = {
                slug: "topic name here",
                description: "description here",
                irrelevantProperty: "irrelevant value"
              }
            return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(201)
            .then(({ body }) => {
                expect(body.topic).toEqual({
                    slug: "topic name here",
                    description: "description here"
                })
            })
        })
    })
});
