#!/usr/bin/env bash

export PUBLIC_KEY_PATH=/home/oscar/projects/ishiko/config/public.pem
export PRIVATE_KEY_PATH=/home/oscar/projects/ishiko/config/private.pem

./mvnw spring-boot:run
