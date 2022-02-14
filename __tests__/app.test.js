const request = require("supertest");
const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed')
const data = require('../db/data/test-data/index.js')

beforeEach(() => seed(data))
afterAll(() => db.end());

describe('app', () => {
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
            .then((article) => {
                expect(article.body).toHaveLength(1);
                expect(article.body[0]).toEqual(
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
    })
})