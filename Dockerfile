FROM amazoncorretto:21.0.3-alpine3.19
COPY build/libs/HumanResourcesApp-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]