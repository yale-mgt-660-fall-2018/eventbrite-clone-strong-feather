const Koa = require('koa');
const pgp = require('pg-promise')();
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const router = require('./routes/routes.js');

/**
 * createApp - returns a Koa application given a config
 * @param  {object} config - the config for the app
 * @returns {app} A Koa application
 */
function createApp(config) {
    // Create our app
    const app = new Koa();

    app.use(bodyParser());

    // Add the database to the app's context prototype.
    // This will make the db available in all controllers.
    app.context.db = pgp(config.databaseURL);

    // Set the port for the app
    app.context.port = config.port;

    // Add view/template engine
    app.use(views(path.join(__dirname, 'views'), {
        map: { njk: 'nunjucks' },
    }));

    // Attach our routes.
    app.use(router.routes());
    return app;
}

// This module exports a function that must
// be called to get an app. It is passed a
// configuration object, as indicated above.
module.exports = createApp;
