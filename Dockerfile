FROM quay.io/quarkus/ubi-quarkus-mandrel-builder-image:jdk-21 AS build
USER root
WORKDIR /code
COPY --chmod=744 mvnw /code/mvnw
RUN chown quarkus:quarkus -R /code 
USER quarkus
RUN ./mvnw -B org.apache.maven.plugins:maven-dependency-plugin:3.1.2:go-offline
