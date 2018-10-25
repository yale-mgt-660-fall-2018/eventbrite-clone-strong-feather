const path = require('path');
const fs = require('fs');

/**
 * Creates the schema in the database
 * @param  {Database} db pg-promise database object
 * @returns {Promise} A promise that you can await or resolve
 */
async function createSchema(db) {
    const pathToSchema = path.join(__dirname, 'schema.sql');
    const sqlStatement = fs.readFileSync(pathToSchema, 'utf8');
    return db.any(sqlStatement);
}

module.exports = {
    createSchema,
};
