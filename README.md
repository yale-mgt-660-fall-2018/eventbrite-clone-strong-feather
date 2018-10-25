
# Social todo Koa/Postgres

This is starter code for the social todo using [Koa](http://koajs.com/)
and [Postgres](https://www.postgresql.org/) via [PG-Promise](https://github.com/vitaly-t/pg-promise).

## Running the app in development

Running this code requires Node >= v8.0 and Postgres >= 10.
If you're working on Cloud9, you'll likely need to install
those.


To run the application, do something like the following.

```
SECRET=foo DATABASE_URL=postgres://postgres@localhost/postgres npm run dev
```

In production, you can use the `npm start` command instead.

Before running the application, you'll need to create the schema
in your Postgres database. You'll do that using *something* like
the following

```
psql -U youruser --host yourhost --port yourport yourdatabase <src/models/schema.sql
```


## Running tests

If you create a test database (careful not to overwrite your production database), you can
run tests and should see output as such.

```
$ SECRET=foo TEST_DATABASE_URL=postgres://foo:bar@localhost/test npm test

> social-todo-koa-postgres-starter@1.0.0 test /Users/kljensen/src/yale-cpsc-213/social-todo-koa-postgres-completed
> jest --forceExit

 PASS  models/test.js
  users
    ✓ can be inserted (18ms)
    ✓ have their email address coverted to lowercase (9ms)
    ✓ cannot have the same email address (19ms)
    ✓ cannot have names longer than 50 characters (10ms)
    ✓ can be found when correct password is provided by not with incorrect (22ms)
  tasks
    ✓ can be inserted (28ms)
    ✓ can be retrieved by user id (19ms)
    ✓ can only be deleted by the owner (19ms)
    ✓ can be shared with other users (19ms)
    ✓ can be toggled complete only by owner and collaborators (23ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        1.254s
Ran all test suites.
```

## File structure

```
.
+-- README.md
├── package-lock.json
├── package.json
├── src
│   ├── app.js - Where the application is defined
│   ├── app.test.js - Tests for the application
│   ├── config.js - Config for the app, fetched from environment
│   ├── controllers - All controllers
│   │   ├── index.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── models - All models
│   │   ├── init.js
│   │   ├── schema.sql
│   │   ├── tasks.js
│   │   ├── test.js
│   │   └── users.js
│   ├── routes - All routes
│   │   └── routes.js
│   ├── services - Misc things that don't fit into models
│   │   └── middleware.js
│   └── views - All views
│       └── index.hbs
└── start.js - Script that starts the app (the server)
```
