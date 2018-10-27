/* global beforeAll, test, expect, describe, beforeEach */
const bluebird = require('bluebird');
const pgp = require('pg-promise')({ promiseLib: bluebird });
const events = require('./events.js');
const init = require('./init.js');

let db;

const demoEvents = [
    {
        title: 'SOM House Party',
        // Note that JavaScript months are zero-indexed,
        // so, month zero is January. This is Jan 17th
        // 2018 at 4:30pm local time.
        date: new Date(2018, 0, 17, 16, 30, 0),
        imageURL: 'http://i.imgur.com/pXjrQ.gif',
        location: 'Kyle \'s house',
        attending: ['kyle.jensen@yale.edu', 'kim.kardashian@yale.edu'],
    },
    {
        title: 'BBQ party for hackers and nerds',
        date: new Date(2017, 8, 1, 19, 0, 0),
        imageURL: 'http://i.imgur.com/7pe2k.gif',
        location: 'Sharon Oster\'s house',
        attending: ['kyle.jensen@yale.edu', 'kim.kardashian@yale.edu'],
    },
    {
        title: 'BBQ for managers',
        date: new Date(2017, 12, 20, 18, 0, 0),
        imageURL: 'http://i.imgur.com/CJLrRqh.gif',
        location: 'Barry Nalebuff\'s house',
        attending: ['kim.kardashian@yale.edu'],
    },
    {
        title: 'Cooking lessons for the busy business student',
        date: new Date(2018, 3, 2, 19, 0, 0),
        imageURL: 'http://i.imgur.com/02KT9.gif',
        location: 'Yale Farm',
        attending: ['homer.simpson@yale.edu'],
    },
];


beforeAll(async () => {
    // Check to make sure the user supplied the
    // TEST_DATABASE_URL environment variable so
    // that we know how to connect to the database!
    const databaseURL = process.env.TEST_DATABASE_URL;
    if (!databaseURL) {
        throw new Error('You must supply a TEST_DATABASE_URL');
    }
    db = pgp(databaseURL);
    try {
        await init.createSchema(db);
    } catch (e) {
        throw new Error(e);
    }
});

// Delete all rows from these tables before starting each set of tests
beforeEach(async () => db.any('TRUNCATE events CASCADE'));

describe('events', async () => {
    test('can be inserted', async () => {
        let firstEventSaved;
        let numEvents;
        let error = null;
        try {
            firstEventSaved = await events.insert(
                db,
                demoEvents[0].title,
                demoEvents[0].date,
                demoEvents[0].imageURL,
                demoEvents[0].location,
            );
            numEvents = await events.count(db);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBe(null);
        expect(firstEventSaved.title)
            .toBe(demoEvents[0].title);
        expect(numEvents)
            .toBe(1);
    });

    test('cannot have names longer than 50 characters', async () => {
        let error = null;
        try {
            await events.insert(
                db,
                'x'.repeat(51),
                demoEvents[0].date,
                demoEvents[0].imageURL,
                demoEvents[0].location,
            );
        } catch (e) {
            error = e;
        }
        expect(error)
            .not.toBeNull();
    });
});
