CREATE TABLE session (
    session_id text PRIMARY KEY NOT NULL,
    expires text NOT NULL
);

CREATE TABLE token_set (
    token_set_id text PRIMARY KEY NOT NULL,
    session_id text NOT NULL,
    access_token text NOT NULL,
    access_token_expires text NOT NULL,
    refresh_token text,
    refresh_token_expires text,
    FOREIGN KEY (session_id) REFERENCES session (session_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE user_profile (
    user_id text PRIMARY KEY NOT NULL,
    session_id text NOT NULL,
    name text,
    first_name text,
    last_name text,
    FOREIGN KEY (session_id) REFERENCES session (session_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
