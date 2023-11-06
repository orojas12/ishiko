INSERT INTO issue_status (id, name) VALUES
    (nextval('issue_status_id_seq'), ''),
    (nextval('issue_status_id_seq'), 'Ready'),
    (nextval('issue_status_id_seq'), 'In progress'),
    (nextval('issue_status_id_seq'), 'In review'),
    (nextval('issue_status_id_seq'), 'Done')
;

INSERT INTO issue_label (id, name) VALUES
    (nextval('issue_label_id_seq'), ''),
    (nextval('issue_label_id_seq'), 'Feature'),
    (nextval('issue_label_id_seq'), 'Enhancement'),
    (nextval('issue_label_id_seq'), 'Documentation'),
    (nextval('issue_label_id_seq'), 'Bug'),
    (nextval('issue_label_id_seq'), 'Other')
;

INSERT INTO issue (id, subject, description, created_date, due_date, status, label)
    SELECT 
        nextval('issue_id_seq'),
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed '
            'do eiusmod tempor incididunt ut labore et dolore magna aliqua. '
            'Ut enim ad minim veniam, quis nostrud exercitation ullamco '
            'laboris nisi ut aliquip ex ea commodo consequat. Duis aute '
            'irure dolor in reprehenderit in voluptate velit esse cillum ',
        '2023-11-01T17:05:33Z',
        '2023-11-04T17:05:33Z',
        s.id,
        l.id
    FROM issue_status AS s, issue_label AS l
;

