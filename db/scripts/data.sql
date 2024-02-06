INSERT INTO users (username, password, enabled)
VALUES ('oscar', '{noop}password', true),
    ('angie', '{noop}password', true),
    ('ivan', '{noop}password', true);
INSERT INTO authorities (username, authority)
VALUES ('oscar', 'ROLE_USER'),
    ('angie', 'ROLE_USER'),
    ('ivan', 'ROLE_USER');
INSERT INTO project (id, name, owner)
VALUES ('project_1', 'Project 1', 'oscar'),
    ('project_2', 'Project 2', 'oscar'),
    ('project_3', 'Project 3', 'oscar');
INSERT INTO status (id, name, project)
VALUES (nextval('status_id_seq'), 'Ready', 'project_1'),
    (
        nextval('status_id_seq'),
        'In progress',
        'project_1'
    ),
    (
        nextval('status_id_seq'),
        'In review',
        'project_1'
    ),
    (nextval('status_id_seq'), 'Done', 'project_1'),
    (nextval('status_id_seq'), 'Ready', 'project_2'),
    (
        nextval('status_id_seq'),
        'In progress',
        'project_2'
    ),
    (
        nextval('status_id_seq'),
        'In review',
        'project_2'
    ),
    (nextval('status_id_seq'), 'Done', 'project_2'),
    (nextval('status_id_seq'), 'Ready', 'project_3'),
    (
        nextval('status_id_seq'),
        'In progress',
        'project_3'
    ),
    (
        nextval('status_id_seq'),
        'In review',
        'project_3'
    ),
    (nextval('status_id_seq'), 'Done', 'project_3');
INSERT INTO label (id, name, project)
VALUES (nextval('label_id_seq'), 'bug', 'project_1'),
    (
        nextval('label_id_seq'),
        'enhancement',
        'project_1'
    ),
    (
        nextval('label_id_seq'),
        'docs',
        'project_1'
    ),
    (nextval('label_id_seq'), 'other', 'project_1'),
    (nextval('label_id_seq'), 'bug', 'project_2'),
    (
        nextval('label_id_seq'),
        'enhancement',
        'project_2'
    ),
    (
        nextval('label_id_seq'),
        'docs',
        'project_2'
    ),
    (nextval('label_id_seq'), 'other', 'project_2'),
    (nextval('label_id_seq'), 'bug', 'project_3'),
    (
        nextval('label_id_seq'),
        'enhancement',
        'project_3'
    ),
    (
        nextval('label_id_seq'),
        'docs',
        'project_3'
    ),
    (nextval('label_id_seq'), 'other', 'project_3');