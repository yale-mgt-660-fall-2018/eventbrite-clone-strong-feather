const Tasks = require('../models/tasks');

/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function create(ctx) {
    return ctx.redirect('/');
}


/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function toggle(ctx) {
    return ctx.redirect('/');
}

/**
 * (Naming this funtion "del" because delete is a keyword.)
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function del(ctx) {
    return ctx.redirect('/');
}

module.exports = {
    create,
    toggle,
    delete: del,
};
