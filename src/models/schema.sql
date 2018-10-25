-- Load up pycrypto so that we can do password hashing
DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE
        CHECK ( email ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' ),
    password_hash VARCHAR(100) NOT NULL
);

-- Define a function that turns a users row
-- email column to lowercase.
CREATE OR REPLACE function clean_user_fields() returns trigger as $$
BEGIN
    NEW.email := lower(NEW.email);
    return NEW;
END;
$$ language plpgsql;

-- This is a "trigger" and it is tiggered prior
-- to and insert or update on the users. It ensures
-- that the email field is stored as lowercase by
-- calling the clean_user_fields() function.
DROP TRIGGER IF EXISTS tg_users_default ON "users";
CREATE TRIGGER tg_users_default
    BEFORE INSERT OR UPDATE
    ON "users"
    FOR EACH ROW
EXECUTE PROCEDURE clean_user_fields();

-- Table of tasks
DROP TABLE IF EXISTS tasks CASCADE;
CREATE TABLE IF NOT EXISTS tasks (
    -- An auto-incrementing primary key
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- A boolean indicating if the task is complete
    is_complete BOOLEAN DEFAULT FALSE NOT NULL,    
    -- The id of the user that owns this task
    user_id INT
        REFERENCES users
        ON DELETE CASCADE
        ON UPDATE CASCADE
        NOT NULL,
    -- The name of the task
    "name" VARCHAR(500) NOT NULL
        CHECK (char_length(name) >= 1),
    -- The description of the task
    description VARCHAR(5000) NOT NULL,
    -- A task may only have one owner
    UNIQUE(id, user_id)
);

-- Table of collaborators on a task
DROP TABLE IF EXISTS users_tasks CASCADE;
CREATE TABLE IF NOT EXISTS users_tasks (
    -- The id of a user
    user_id INT
        REFERENCES users
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- The id of a task
    task_id INT
        REFERENCES tasks
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    -- A person may only be listed on a 
    -- task once. PRIMARY KEY enforces uniqueness
    PRIMARY KEY (user_id, task_id)
);