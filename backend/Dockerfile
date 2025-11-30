FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src
COPY uploads ./uploads

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B
RUN ./mvnw package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/backend-0.0.1-SNAPSHOT.jar"]
