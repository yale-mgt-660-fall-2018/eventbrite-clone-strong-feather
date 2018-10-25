const Tasks = require('../models/tasks');


/**
 * Middleware that checks if a user is logged in. If so,
 * it calls the function/handler/middleware, otherwise it
 * returns a 401 response.
 * @param  {Context} ctx - A Koa Context
 * @param  {Function} next - The next function to call to handle the request
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function mustBeAuthorized(ctx, next) {
    if (ctx.isAuthenticated()) {
        return next();
    }
    return ctx.throw(401, 'Unauthorized');
}

/**
 * Middleware that loads all of a users tasks if they are
 * logged in, adding them to the `ctx.state` namespace, so
 * that they can be rendered in the views easily.
 * @param  {Context} ctx - A Koa Context
 * @param  {Function} next - The next function to call to handle the request
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function loadUserTasks(ctx, next) {
    if (ctx.isAuthenticated() && ctx.state.user) {
        ctx.state.tasks = await Tasks.getByUserID(ctx.db, ctx.state.user.id);
    }
    return next();
}


module.exports = {
    mustBeAuthorized,
    loadUserTasks,
};
