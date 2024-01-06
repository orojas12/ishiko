# syntax=docker/dockerfile:1

FROM eclipse-temurin:21-jdk-alpine as dev
WORKDIR /usr/ishiko/api
EXPOSE 8080
CMD ./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
