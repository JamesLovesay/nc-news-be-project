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
            .get('/not an endpoint')
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

    
    describe('GET - api/articles/:article', () => {
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
                    comment_count: '11'
                }))
            })
        })
    })

    describe('PATCH - /api/articles/:article_id', () => {
        test('test that patch request returns updated body when passed a valid request', () => {
            const updateToArticle = {inc_votes: 1}
            return request(app)
            .put('/api/articles/1')
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
            .put('/api/articles/1')
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
            .put('/api/articles/985')
            .send(updateToArticle)
            .expect(404)
            .then(({body: { msg }}) => {
                expect(msg).toBe("article not found"); 
             })
        })
        test('status: 400, responds with error of "bad request" if user selects endpoint with invalid path', () => {
            const updateToArticle = {inc_votes : 1}
            return request(app)
            .put('/api/articles/not-an-id')
            .send(updateToArticle)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that does not contain an inc_votes property', () => {
            const updateToArticle = {some_irrelevant_property : 1}
            return request(app)
            .put('/api/articles/1')
            .send(updateToArticle)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
            })
        })
        test('status: 400, responds with error of "bad request by user" if user provides an object that contains an inc_votes property, but the value of that property is not a number', () => {
            const updateToArticle = {inc_votes : "not a number"}
            return request(app)
            .put('/api/articles/1')
            .send(updateToArticle)
            .expect(400)
            .then(({body: { msg }}) => {
               expect(msg).toBe("bad request by user"); 
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

});