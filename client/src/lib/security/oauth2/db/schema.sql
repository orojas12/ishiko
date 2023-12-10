CREATE TABLE user (
    id text PRIMARY KEY NOT NULL,
    name text
);

CREATE TABLE oauth2_key (
    id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    provider_id text NOT NULL,
    provider_user_id text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (provider_id, provider_user_id)
        ON CONFLICT ROLLBACK
);

CREATE TABLE oauth2_token_set (
    id text PRIMARY KEY NOT NULL,
    oauth2_key_id text NOT NULL,
    access_token text NOT NULL,
    access_token_expires text NOT NULL,
    refresh_token text,
    refresh_token_expires text,
    FOREIGN KEY (oauth2_key_id) REFERENCES oauth2_key (id)
        ON DELETE CASCADE ON UPDATE RESTRICT
);

CREATE TABLE user_session (
    id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    active_expires text NOT NULL,
    idle_expires text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);
