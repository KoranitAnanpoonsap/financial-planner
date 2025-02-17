# Use a base image with JDK 23 (adjust if a specific image is needed)
FROM openjdk:23

# Set the working directory in the container
WORKDIR /app

# Copy your executable JAR into the container
# (Adjust the path if your JAR is located elsewhere)
COPY build/libs/finplanner-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app uses (commonly 8080)
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
