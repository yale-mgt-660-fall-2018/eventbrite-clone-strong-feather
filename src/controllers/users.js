const Users = require('../models/users');

/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function login(ctx) {
    const data = {};
    const template = 'index.hbs';
    return ctx.render(template, data);
}


/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function register(ctx) {
    return ctx.redirect('/');
}


/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function logout(ctx) {
    return ctx.redirect('/');
}

module.exports = {
    login,
    logout,
    register,
};
