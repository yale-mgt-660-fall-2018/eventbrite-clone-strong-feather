const Koa = require('koa');
const session = require('koa-session');
const pgp = require('pg-promise')();
const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const passport = require('koa-passport');
const router = require('./routes/routes.js');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

/**
 * createApp - returns a Koa application given a config
 * @param  {object} config - the config for the app
 * @returns {app} A Koa application
 */
function createApp(config) {
    // Create our app
    const app = new Koa();

    app.use(bodyParser());

    app.keys = [config.secret];
    app.use(session(app));
    app.use(passport.initialize());
    app.use(passport.session());

    // Add the database to the app's context prototype.
    // This will make the db available in all controllers.
    app.context.db = pgp(config.databaseURL);

    // Set the port for the app
    app.context.port = config.port;

    // Add view/template engine
    app.use(views(path.join(__dirname, 'views'), {
        map: { hbs: 'handlebars', njk: 'nunjucks' },
    }));

    // Attach our routes.
    app.use(router.routes());
    return app;
}

// This module exports a function that must
// be called to get an app. It is passed a
// configuration object, as indicated above.
module.exports = createApp;
