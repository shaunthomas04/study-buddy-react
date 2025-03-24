const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {onDocumentUpdated } = require("firebase-functions/v2/firestore");


//Simple HTTP function
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello world function triggered!");
  response.send("Hello from Firebase HTTP function!");
});

// Simple db trigger function
exports.logUserUpdate = onDocumentUpdated("users/{userId}", (event) => {
  const previousValue = event.data.before.data();
  const newValue = event.data.after.data();
  const userId = event.params.userId;

  logger.log("User updated:", userId);
  logger.log("Previous value:", previousValue);
  logger.log("New value:", newValue);

  // You can add more complex logic here based on the update.
  // Example: Check if a specific field changed.
  if (previousValue.name !== newValue.name) {
    logger.log(`User ${userId} name changed from ${previousValue.name} to ${newValue.name}`);
  }

  return null; // Return null or a promise to indicate completion.
});