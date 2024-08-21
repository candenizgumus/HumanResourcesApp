FROM amazoncorretto:21.0.3-alpine3.19
COPY build/libs/HumanResourcesApp-0.0.1-SNAPSHOT.jar app.jar
COPY hip-field-428707-f0-cde160830f3e.json google.json
ENTRYPOINT ["java","-jar","app.jar"]