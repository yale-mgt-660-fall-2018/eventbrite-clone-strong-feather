
# Evenbrite clone Koa/Postgres

This is starter code for the Evenbrite clone using [Koa](http://koajs.com/)
and [Postgres](https://www.postgresql.org/) via [PG-Promise](https://github.com/vitaly-t/pg-promise).

The class project for MGT660 is slightly different than that for MGT656. The
main difference is that you're required to use a database backend. Most every app
you develop for the "real world" will have some kind of database backend. However,
we did not discuss how to use databases in class or the previous homework assignments.
Therefore, you'll likely want to do some reading about how databases relate to web
applications. I recommend reading what you can about the [12factor app](https://12factor.net/)
recommendations. (In that link, the first five parts of the 12factor app model are
the most important. The others are not particularly applicable to your class 
project.)

Often, "wiring up" applications correctly is the most time consuming
part of developing your application. In this starter code, I've wired everything
together for you already---the application, database connections, tests, modules,
templates, etc. You don't have to use this starter code. If you choose not to,
I hope you'll come see me so that I can offer the same kind of assistance I've
offered here in the starter code.

In this starter code, I chose to use [Koa](http://koajs.com/) instead of 
[Express](http://expressjs.com/), which is being used in MGT656. Koa is 
a more modern web application framework for
[Node](https://nodejs.org/en/) than Express. In paticular, Koa uses
the [async/await](https://www.google.com/search?q=javascript+async+await)
features of recent versions of Node. These features make it much more 
ergonomic to write [asynchronous](https://eloquentjavascript.net/11_async.html)
code. You'll find [async/await style features in many languages](https://en.wikipedia.org/wiki/Async/await).


## Running Postgres

There are many ways to run Postgres. If you are working on Cloud9, you likely
want to run Postgres locally on the Cloud9 VM, or use some kind of Postgres-as-a-service
offering, like those from Heroku or AWS. You can't run Docker on Cloud9.

If you are working locally on your computer, it is likely easiest to run
Postgres using Docker using the
[official Postgres Docker image](https://hub.docker.com/_/postgres/).

To install that image, run

```
docker pull postgres
```

Then, you can run a development database like

```
docker run -p 7000:5432 -e POSTGRES_PASSWORD=dev_pass -e POSTGRES_USER=dev_user -e POSTGRES_DB=dev_db postgres
```

This will expose Postgres on port 7000 of your computer. To connect to this instance
of Postgres from your computer, assuming you have a Postgres client on your computer,
you'd do something like this:

```
psql --host localhost --port 7000 -U dev_user dev_db
```

You can, at the same time, run
another instance of Postgres for testing purposes on a different port, e.g.

```
docker run -p 6000:5432 -e POSTGRES_PASSWORD=testing_pass -e POSTGRES_USER=testing_user -e POSTGRES_DB=testing_db postgres
```

Typically, the testing database get's "nuked" each time tests are run. So, you
don't want to use the same database for testing as you do for development. And,
clearly, neither is your production database!

## Running the app in development

Running this code requires Node >= v8.0 and Postgres >= 10.
If you're working on Cloud9, you'll likely need to install
those.


To run the application, do something like the following.

```
SECRET=foo DATABASE_URL=postgres://postgres@localhost/postgres npm run dev
```

In production, you can use the `npm start` command instead.

Before running the application in production, you'll need to create the schema
in your Postgres database. You'll do that using *something* like
the following

```
psql -U youruser --host yourhost --port yourport yourdatabase <src/models/schema.sql
```

The particular host, port, password, and database will depend on how you
are running Postgres in production.

## Running tests

If you create a test database (careful not to overwrite your production database), you can
run tests and should see output as such.

```
$ SECRET=foo TEST_DATABASE_URL=postgres://testing_user:testing_pass@localhost:6000/testing_db npm test

> Evenbrite-clone-koa-postgres-starter@1.0.0 test /Users/kljensen/src/yale-cpsc-213/Evenbrite-clone-koa-postgres-completed
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
