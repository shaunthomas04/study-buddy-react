const {onRequest} = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } = require('firebase-admin/firestore');
const { user } = require("firebase-functions/v1/auth");
const { log } = require("firebase-functions/logger");


//Simple HTTP function
exports.helloWorld = onRequest((request, response) => {
  logger.info("Hello world function triggered!");
  response.send("Hello from Firebase HTTP function!");
});

const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
 
const getUserInfo = async (userId) => {
    const userRef = db.collection("users").doc(userId);
    const docSnapshot = await userRef.get();
    return docSnapshot.exists ? docSnapshot.data() : null;
}



exports.getUserInfoHTTP = onRequest(async (req, res) => {
try {
    const userHash = "L6OWogOvbBV5ywI9B9JgMcRPOSx1";

    const userData = await getUserInfo(userHash);
    if (!userData) {
        console.error(`User ${userHash} not found in Firestore.`);
        res.status(404).json({ error: "User not found" });
        return;
    }


    console.log("User data:", userData);

    res.status(200).json(userData);
} 
catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user: " + error.message });
}
});











exports.updateUserOnFirestoreChange = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    try {
      const previousValue = event.data.before.data();
      const newValue = event.data.after.data();
      const userId = event.params.userId;

      logger.log(`User ${userId} document found.`);

      const userInfo = await getUserInfo(userId); 
        if (!userInfo) {
            logger.error(`User ${userId} not found in Firestore.`);
            return;
        }
        else{
            console.log("User info: ", userInfo);
        }
        
    //   const courses = userInfo.courses;
    //   const buddies = userInfo.buddies;  

      logger.log(`User ${userId} courses: ${courses} and buddies: ${buddies}`);


      // Add more logic here to update other parts of your data or trigger other actions.
    } catch (error) {
      logger.error("Error updating user on Firestore change:", error);
    }
  }
);