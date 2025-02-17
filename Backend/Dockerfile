# Stage 1: Build the application using Gradle
FROM gradle:8.10.2-jdk23 AS builder
WORKDIR /home/app
COPY . .
RUN ./gradlew clean build --no-daemon

# Stage 2: Create the runtime image
FROM openjdk:23
WORKDIR /app
# Copy the JAR built in the previous stage. Adjust the path if necessary.
COPY --from=builder /home/app/build/libs/finplanner-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
