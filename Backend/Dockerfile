# Use OpenJDK 23 as the base image
FROM openjdk:23-jdk-slim

# Set work directory
WORKDIR /app

# Copy Gradle files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

# Grant execute permissions to Gradle wrapper
RUN chmod +x gradlew

# Build the application (skip tests)
RUN ./gradlew build -x test

# Copy the JAR file explicitly
RUN cp build/libs/*.jar app.jar

# Expose the port (Render dynamically assigns ports)
EXPOSE $PORT

# Start the application
CMD ["java", "-jar", "app.jar"]
