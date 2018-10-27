-- Load up pycrypto so that we can do password hashing
DROP EXTENSION IF EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS events CASCADE;
CREATE TABLE IF NOT EXISTS events (
    -- Integer primary key for events
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    -- 'date' is a reserved word in some SQL dialects.
    -- Here I quoted it to make sure it is interpreted
    -- as a column name.
    "date" TIMESTAMP WITH TIME ZONE NOT NULL,
    -- The 'image_url' must be a URL ending in png, gif.
    image_url TEXT NOT NULL
        CHECK ( image_url ~ '^https?://.*\.(png|gif)$' ),
    "location" TEXT NOT NULL,
    -- Record the time at which this event was created
    created_at TIMESTAMP WITH TIME ZONE
        NOT NULL
        DEFAULT current_timestamp

);
-- Turn on verbose error messages, which helps our JavaScript
-- code handle database errors in a graceful manner.
SET log_error_verbosity TO 'verbose';
-- \set VERBOSITY verbose