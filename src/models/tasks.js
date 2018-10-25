/**
 * @param {Database} db - Pg-promise database object
 * @param  {Int} userID - ID of the task owner
 * @param  {String} name - Name of the new task
 * @param  {String} description - Description of new task
 * @returns {Promise} - Promise that resolves to new row in db.
 */
async function insert(db, userID, name, description) {
    const stmt = `
        INSERT INTO tasks (user_id, name, description)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    return db.one(stmt, [userID, name, description]);
}

/**
 * Creates a new task with the specified owner and collaborators.
 * Takes an array of collaborator emails and fails if the
 * collaborators do not exist.
 * @param {Database} db - Pg-promise database object
 * @param  {Int} userID - ID of the task owner
 * @param  {String} name - Name of the new task
 * @param  {String} description - Description of new task
 * @param  {String[]} collaboratorEmails - Array of collaborator emails
 * @returns {Promise} - Promise that resolves to new row in db.
 */
async function insertWithCollaboratorsByEmail(db, userID, name, description, collaboratorEmails) {
    if (collaboratorEmails.length === 0) {
        return insert(db, userID, name, description);
    }

    const stmt = `
        WITH
            -- Create a temporary table that holds just one row containing
            -- the id of the newly created task
            newTasks AS
                (INSERT INTO tasks (user_id, name, description)
                 VALUES ($1, $2, $3) RETURNING id),
            -- Turn our array of email addresses into an "emails" table
            -- with a column called "email"
            emails AS (SELECT * FROM unnest($4) as t(email)),
            -- Looks up the users that have these email addresses
            collaborators AS (SELECT users.* FROM emails LEFT JOIN users ON emails.email = users.email)
        INSERT INTO users_tasks
            SELECT collaborators.id, newTasks.id FROM collaborators, newTasks
    `;
    return db.any(stmt, [userID, name, description, collaboratorEmails]);
}

/**
 * @param {Database} db - Pg-promise database object
 * @returns {Promise} - Promise that resolves to and int
 */
async function count(db) {
    const stmt = 'select COUNT(*) FROM tasks';
    const result = await db.one(stmt);
    return parseInt(result.count, 10);
}

/**
 * Returns all tasks with a particular id
 * @param {Database} db - Pg-promise database object
 * @param  {Int} id - ID of the task
 * @returns {Promise} - Promise that resolves a task object
 */
async function getByID(db, id) {
    return db.one('SELECT * FROM tasks WHERE id=$1', [id]);
}

/**
 * Returns all tasks owned by or shared with a user
 * @param {Database} db - Pg-promise database object
 * @param  {Int} userID - ID of the task owner
 * @returns {Promise} - Promise that resolves to and int
 */
async function getByUserID(db, userID) {
    const stmt = `
        SELECT DISTINCT id, name, description, is_complete, (tasks.user_id = $1) as is_owned
        FROM tasks LEFT OUTER JOIN users_tasks ON (tasks.id = users_tasks.task_id)
        WHERE tasks.user_id = $1 OR users_tasks.user_id = $1;
    `;
    return db.any(stmt, [userID]);
}

/**
 * Deletes a task by id and user id
 * @param {Database} db - Pg-promise database object
 * @param  {Int} userID - ID of the task owner
 * @param  {Int} id - ID of the task
 * @returns {Promise} - Promise that resolves the number of rows affected
 */
async function deleteForUserByID(db, userID, id) {
    const stmt = 'DELETE FROM tasks WHERE id=$1 AND user_id=$2';
    // See https://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example#raw-result
    const result = await db.result(stmt, [id, userID]);
    return result.rowCount;
}

/**
 * Shares a task with another user
 * @param {Database} db - Pg-promise database object
 * @param  {Int} userID - ID of the task owner
 * @param  {Int} id - ID of the task
 * @returns {Promise} - Promise that resolves a task object
 */
async function shareWithUserByID(db, userID, id) {
    const stmt = 'INSERT INTO users_tasks (user_id, task_id) VALUES ($1, $2) RETURNING *';
    return db.one(stmt, [userID, id]);
}

/**
 * Mark a task as complete for a user
 * @param {Database} db - Pg-promise database object
 * @param  {Int} userID - ID of the task owner
 * @param  {Int} id - ID of the task
 * @returns {Promise} - Promise that resolves the number of rows affected
 */
async function toggleCompleteForUserByID(db, userID, id) {
    // This query is written such that the task will only be
    // toggled complete if the user is the owner of the task
    // or the task has been shared with them.
    const stmt = `
        UPDATE tasks SET is_complete = NOT is_complete
        WHERE
            tasks.id = $1
        AND (
            tasks.user_id = $2
            OR EXISTS(
                SELECT * FROM users_tasks
                WHERE task_id = $1
                AND user_id = $2
            )
        )
    `;
    const result = await db.result(stmt, [id, userID]);
    return result.rowCount;
}


module.exports = {
    getByID,
    insert,
    insertWithCollaboratorsByEmail,
    count,
    getByUserID,
    deleteForUserByID,
    shareWithUserByID,
    toggleCompleteForUserByID,
};
