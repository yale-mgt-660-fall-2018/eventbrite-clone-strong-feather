/* global beforeAll, test, expect, describe, beforeEach */
const pgp = require('pg-promise')();
const users = require('./users.js');
const tasks = require('./tasks.js');

let db;
const init = require('./init.js');

const demoUsers = [
    {
        name: 'Lauren Blake',
        email: 'lauren@foo.com',
        password: 'foo',
    },
    {
        name: 'Joe Carlson',
        email: 'joe@foo.com',
        password: 'foo',
    },
    {
        name: 'Kathryn Muller',
        email: 'kathryn@bar.edu',
        password: 'foo',
    },
];

const demoTasks = [
    {
        name: 'Get milk',
        description: 'From Costco',
    },
    {
        name: 'Get bread',
        description: 'From Stop and Shop',
    },
    {
        name: 'Get beer',
        description: 'From the Wine Thief',
    },
];

// Create a new schema with a random name
// prior to running tests.
beforeAll(async () => {
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

beforeEach(async () => db.any('TRUNCATE users_tasks, tasks, users CASCADE'));

describe('users', async () => {
    let firstUserDB;
    const firstUser = demoUsers[0];

    test('can be inserted', async () => {
        let error = null;
        let numUsers = 0;
        try {
            firstUserDB = await users.insert(
                db,
                firstUser.name,
                firstUser.email.toUpperCase(),
                firstUser.password,
            );
            numUsers = await users.count(db);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBe(null);
        expect(numUsers)
            .toBe(1);
    });

    test('have their email address coverted to lowercase', async () => {
        expect(firstUserDB.email)
            .toBe(firstUser.email.toLowerCase());
    });

    test('cannot have the same email address', async () => {
        let error = null;
        try {
            await users.insert(
                db,
                firstUser.name,
                firstUser.email,
                firstUser.password,
            );
            await users.insert(
                db,
                firstUser.name,
                firstUser.email,
                firstUser.password,
            );
        } catch (e) {
            error = e;
        }
        expect(error)
            .not.toBeNull();
    });

    test('cannot have names longer than 50 characters', async () => {
        let error = null;
        try {
            firstUserDB = await users.insert(
                db,
                'x'.repeat(51),
                firstUser.email.toUpperCase(),
                firstUser.password,
            );
        } catch (e) {
            error = e;
        }
        expect(error)
            .not.toBeNull();
    });

    test('can be found when correct password is provided by not with incorrect', async () => {
        let error = null;
        const user = demoUsers[0];
        let dbuser1;
        let dbuser2;
        try {
            await users.insert(db, user.name, user.email, user.password);
            dbuser1 = await users.getByCredentials(db, user.email, user.password);
            dbuser2 = await users.getByCredentials(db, user.email, 'wrong-password');
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBe(null);
        expect(dbuser1.email)
            .toBe(user.email);
        expect(dbuser2)
            .toBe(null);
    });
});

describe('tasks', async () => {
    let dbusers = [];
    beforeEach(async () => {
        // Insert the demo users
        const promises = demoUsers.map(u => users.insert(db, u.name, u.email, u.password));
        dbusers = await Promise.all(promises);
    });

    test('can be inserted', async () => {
        let error = null;
        const u = dbusers[0];
        const t = demoTasks[0];
        let dbtask;
        try {
            dbtask = await tasks.insert(db, u.id, t.name, t.description);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(await tasks.count(db))
            .toBe(1);
        expect(dbtask.user_id)
            .toBe(u.id);
    });

    test('can be retrieved by user id', async () => {
        let error = null;
        const u = dbusers[0];
        const t = demoTasks[0];
        let tasksForUser;
        try {
            await tasks.insert(db, u.id, t.name, t.description);
            tasksForUser = await tasks.getByUserID(db, u.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(await tasks.count(db))
            .toBe(1);
        expect(tasksForUser.length)
            .toBe(1);
        expect(tasksForUser[0].is_owned)
            .toBe(true);
    });

    test('can only be deleted by the owner', async () => {
        let error = null;
        const u0 = dbusers[0];
        const u1 = dbusers[1];
        const t = demoTasks[0];
        let numDeleted;
        let tasksForUser;

        // Insert task
        try {
            await tasks.insert(db, u0.id, t.name, t.description);
            tasksForUser = await tasks.getByUserID(db, u0.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();

        // Other user cannot delete
        try {
            numDeleted = await tasks.deleteForUserByID(db, u1.id, tasksForUser[0].id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(numDeleted)
            .toBe(0);

        // But the owner can
        try {
            numDeleted = await tasks.deleteForUserByID(db, u0.id, tasksForUser[0].id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(numDeleted)
            .toBe(1);
    });


    test('can be shared with other users', async () => {
        let error = null;
        const u0 = dbusers[0];
        const u1 = dbusers[1];
        const t = demoTasks[0];
        let tasksForUser;
        try {
            const dbtask = await tasks.insert(db, u0.id, t.name, t.description);
            await tasks.shareWithUserByID(db, u1.id, dbtask.id);
            tasksForUser = await tasks.getByUserID(db, u1.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(tasksForUser.length)
            .toBe(1);
    });


    test('can be toggled complete only by owner and collaborators', async () => {
        let error = null;
        const u0 = dbusers[0];
        const u1 = dbusers[1];
        const u2 = dbusers[2];
        const t = demoTasks[0];
        let dbtask1;
        let dbtask2;
        let rowsToggled;

        // Insert task
        try {
            dbtask1 = await tasks.insert(db, u0.id, t.name, t.description);
            await tasks.shareWithUserByID(db, u1.id, dbtask1.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();

        // User 2 should not be able to toggle
        try {
            rowsToggled = await tasks.toggleCompleteForUserByID(db, u2.id, dbtask1.id);
            dbtask2 = await tasks.getByID(db, dbtask1.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(rowsToggled)
            .toBe(0);
        expect(dbtask2.is_complete)
            .toBe(false);

        // User 1 should  be able to toggle
        try {
            rowsToggled = await tasks.toggleCompleteForUserByID(db, u1.id, dbtask1.id);
            dbtask2 = await tasks.getByID(db, dbtask1.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(rowsToggled)
            .toBe(1);
        expect(dbtask2.is_complete)
            .toBe(true);

        // User 0 should  be able to toggle back
        try {
            rowsToggled = await tasks.toggleCompleteForUserByID(db, u0.id, dbtask1.id);
            dbtask2 = await tasks.getByID(db, dbtask1.id);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(rowsToggled)
            .toBe(1);
        expect(dbtask2.is_complete)
            .toBe(false);
    });

    test('can be created with collaborators', async () => {
        const u0 = dbusers[0];
        const u1 = dbusers[1];
        const t = demoTasks[0];
        const emails = demoUsers.map(u => u.email);
        let error = null;
        try {
            await tasks.insertWithCollaboratorsByEmail(db, u0.id, t.name, t.description, emails);
        } catch (e) {
            console.error(e);
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(await tasks.count(db))
            .toBe(1);
        let tasksForUser = await tasks.getByUserID(db, u0.id);
        expect(tasksForUser.length)
            .toBe(1);
        tasksForUser = await tasks.getByUserID(db, u1.id);
        expect(tasksForUser.length)
            .toBe(1);
    });


    test('cannot be created with invalid collaborators', async () => {
        const u0 = dbusers[0];
        const u1 = dbusers[1];
        const t = demoTasks[0];
        const emails = ['invalid@invalid.com', u1.email];
        let error = null;
        try {
            await tasks.insertWithCollaboratorsByEmail(db, u0.id, t.name, t.description, emails);
        } catch (e) {
            error = e;
        }
        expect(error)
            .not.toBeNull();
        expect(await tasks.count(db))
            .toBe(0);
    });

    test('can be created with empty collaborators', async () => {
        const u0 = dbusers[0];
        const t = demoTasks[0];
        let error = null;
        try {
            await tasks.insertWithCollaboratorsByEmail(db, u0.id, t.name, t.description, []);
        } catch (e) {
            error = e;
        }
        expect(error)
            .toBeNull();
        expect(await tasks.count(db))
            .toBe(1);
    });
});
