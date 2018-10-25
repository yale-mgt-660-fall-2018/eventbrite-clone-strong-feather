/**
 * @param {Database} db - Pg-promise database object
 * @param  {String} name - Name of the new user
 * @param  {String} email - Email address for new user
 * @param  {String} password - Password (unhashed) for new user
 * @returns {Promise} - Promise that resolves to new row in db.
 */
async function insert(db, name, email, password) {
    const stmt = `
        INSERT INTO users (name, email, password_hash)
        VALUES ($1, $2, crypt($3, gen_salt('bf'::TEXT)))
        RETURNING id, email
    `;
    return db.one(stmt, [name, email, password]);
}

/**
 * @param {Database} db - Pg-promise database object
 * @returns {Promise} - Promise that resolves to and int
 */
async function count(db) {
    const stmt = 'select COUNT(*) FROM users';
    const result = await db.one(stmt);
    return parseInt(result.count, 10);
}

/**
 * @param {Database} db - Pg-promise database object
 * @param  {String} email - Email address for new user
 * @param  {String} password - Password (unhashed) for new user
 * @returns {Promise} - Promise that resolves to a user object or null
 */
async function getByCredentials(db, email, password) {
    const stmt = `
        SELECT * FROM users WHERE
        email=lower($1) AND password_hash=crypt($2, password_hash)
    `;
    return db.oneOrNone(stmt, [email, password]);
}

/**
 * @param  {Database} db - Pg-promise database object
 * @param  {String} email - Email address for a user
 * @returns {Promise} - Promise that resolves to one user or null
 */
async function getByEmail(db, email) {
    const stmt = `
        SELECT * FROM users WHERE
        email=lower($1)
    `;
    return db.oneOrNone(stmt, [email]);
}

module.exports = {
    insert,
    count,
    getByCredentials,
    getByEmail,
};
