FROM postgres:16-alpine

WORKDIR /

COPY ./schema.sql /ishiko/db/schema.sql
COPY ./data.sql /ishiko/db/data.sql
COPY ./init-dev-db.sh /docker-entrypoint-initdb.d/init-dev-db.sh
