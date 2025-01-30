# Use an official OpenJDK runtime as a parent image
FROM openjdk:23-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Gradle build files
COPY gradlew .
COPY gradle/ gradle/
COPY build.gradle .
COPY settings.gradle .
COPY src/ src/

# Grant execute permission to Gradle wrapper
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test

# Expose port (Render assigns dynamic ports)
EXPOSE $PORT

# Run the application
CMD ["java", "-jar", "build/libs/*.jar"]
