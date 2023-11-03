DROP TABLE IF EXISTS issue;

CREATE TABLE issue_status (
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE issue_label (
    id serial PRIMARY KEY,
    name varchar(50) NOT NULL
);

CREATE TABLE issue (
    id serial PRIMARY KEY,
    subject varchar(255) NOT NULL,
    description varchar(1000),
    created_date timestamp with time zone NOT NULL,
    due_date timestamp with time zone,
    status integer REFERENCES issue_status (id),
    label integer REFERENCES issue_label (id)
);