/* globals describe, test, expect, beforeAll */

// Jest testing for our app.
// See https://hackernoon.com/async-testing-koa-with-jest-1b6e84521b71

const request = require('supertest');
const makeApp = require('./app.js');

describe('our app', () => {
    let app;
    beforeAll(() => {
        app = makeApp({
            databaseURL: process.env.TEST_DATABASE_URL,
        });
    });

    test('root route is up', async () => {
        const response = await request(app.callback())
            .get('/');

        expect(response.status)
            .toBe(200);
    });
});
