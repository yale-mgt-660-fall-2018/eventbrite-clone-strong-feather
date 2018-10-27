
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
DATABASE_URL=postgres://dev_user:dev_pass@localhost/dev_db npm run dev
```

In production, you can use the `npm start` command instead. And, you'll 
need to set your `DATABASE_URL` environment variable using a manner appropriate
for your hosting provider, e.g. `heroku config` if you're running on Heroku.

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
$ TEST_DATABASE_URL=postgres://testing_user:testing_pass@localhost:6000/testing_db npm test

> project-starter-koa-postgres@1.0.0 test /Users/kljensen/src/github.com/yale-mgt-660-fall-2018/project-starter-koa-postgres
> jest --forceExit --detectOpenHandles --verbose --no-cache

 PASS  src/models/test.js
  events
    ✓ can be inserted (25ms)
    ✓ cannot have names longer than 50 characters (12ms)

 PASS  src/app.test.js
  our app
    ✓ root route is up (658ms)

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        3.736s
Ran all test suites.

```

You should write more tests. They are helpful!

## File structure

```
.
├── README.md - This file
├── package-lock.json - Locked down dependency tree
├── package.json - Defined of dependencies and scripts
├── src
│   ├── app.js - Main app defined here
│   ├── app.test.js - Simple tests of the app; you should make more
│   ├── config.js - Configuration, reads environment variables mostly
│   ├── controllers- Controllers/handlers, these handle requests
│   │   └── index.js 
│   ├── models - Models, code that talks to the database
│   │   ├── events.js - Functions for getting events in and out of db
│   │   ├── init.js - Code for initializing db
│   │   ├── schema.sql - SQL schema
│   │   └── test.js - Tests of functions for talking to db; write more!
│   ├── routes
│   │   └── routes.js - Our routes---maps URLs to controllers/handlers
│   └── views
│       └── index.njk - Our views---the HTML we render
└── start.js - Script that starts the app
```

## Sage counsel

It will benefit both you and me if you come to office hours. Also, you
ought to feel free to ask project-related questions at the start of class
each day. And, you can always send me code, screenshots, questions, and
problems through Piazza.

Here are a few pieces of advice that I think are particuarly important
and that I want to give you at the very start of your project.

* Get good at git. Use branching. Use line-by-line staging, such as that
  you can get using the GitHub gui, GitX, or other git guis.
* Push to branches on GitHub. Figure out who on your team is going to 
  merge branches into master.
* Write tests. I wrote a number of tests in this repo and I hope they
  illustrate to you the utility of tests. It makes writing code faster
  and allows you to make changes in the future with greater confidence.
  Don't make commits to master until you've run your tests and verify
  they pass.
* Make your database do the work. This project has a few "integrity"
  related requirements, e.g. event titles have to be no more than 
  XYZ characters. You should code that constraint in the database
  rather than the app. There are two reasons for this: 1) relational
  databases are *fantastic* at enforcing constraints on data and
  doing so using a
  [declarative](https://en.wikipedia.org/wiki/Declarative_programming)
  fashion; and, 2) this means your database is always "correct", so 
  that if another program wants to use the database---like an API server
  for mobile clients written in a different language---you don't have
  to reimplement the data integrity logic. It ought to be *impossible*
  to store invalid data in your database. Using this method, your
  app should try to store data in the database (like a new event)
  and then check for errors returned by the database, rather than 
  checking for data integrity and then sending it to the database.
  You can use `try` and `catch` as shown in the `models/test.js` file.
* Make your controllers/handlers "skinny". Make your models "fat". Keep logic
  out of the controller and move it to the model-related code. E.g.
  if your controller needs to create a new event or RSVP a person
  for an event, create a function in your models code for that.
  The function should be small and you should write a test for
  it. It is easier to test functions like that than it is to 
  test controllers/handlers.
* Don't ignore complainst by ESLint. Customize the `.jsbeautifyrc`
  file as you like, also the `.eslintrc` file.
* RTFMP---read the freaking "man" pages. "Man" pages are the
  manual pages of old. You likely won't use man pages *per se*
  (though you can on your mac/*nix machine---type "man"), but
  instead you'll definitely need to often to refer to the documentation
  for packages/modules/projects you're using such as Koa, pgpromise,
  nunjucks, and whatever you add yourself. How do you add static
  assets? RTFMP. Parse a POST body? RTFMP. A huge part of development
  is RTFMP and also reading other people's code.
* Don't get frustrated. If you get stuck for more than 30m, take
  a walk, talk to the TAs or another students. If you're still stuck,
  please talk to me. I will know most answers immediately and I'm
  happy to help.