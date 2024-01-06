#!/usr/bin/env bash

export PUBLIC_KEY_PATH=/usr/ishiko/config/public.pem
export PRIVATE_KEY_PATH=/usr/ishiko/config/private.pem

./mvnw spring-boot:run
