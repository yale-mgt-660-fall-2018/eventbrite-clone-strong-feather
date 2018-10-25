/**
 * @param  {Context} ctx - A Koa Context
 * @returns {Promise} - Returns a promise that resolves to undefined
 */
async function index(ctx) {
    const template = 'index.hbs';
    return ctx.render(template);
}

module.exports = {
    index,
};
