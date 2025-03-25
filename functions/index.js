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

// Setup Firestore connection
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
 
// Function to get user info from Firestore
const getUserInfo = async (userId) => {
    const userRef = db.collection("users").doc(userId);
    const docSnapshot = await userRef.get();
    return docSnapshot.exists ? docSnapshot.data() : null;
}

// Function to get all users from Firestore
const getAllUsers = async () => {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.get();
  
      if (snapshot.empty) {
        throw new Error("No users found");
      }
  
      const usersList = [];
      snapshot.forEach(doc => {
        usersList.push({ id: doc.id, ...doc.data() }); 
      });
  
      return usersList; // Return the entire users collection as a list
    } 
    catch (error) {
      throw new Error("Error fetching users: " + error.message);
    }
  };

// Function to reccomend buddies to a user
const reccomendBuddies = async (userId) => {
    // Get user's courses and buddies info
    const userInfo = await getUserInfo(userId);
    if (!userInfo) {
        logger.error(`User ${userId} not found in Firestore.`);
        return;
    }
    const courses = userInfo.courses;
    const userBuddies = userInfo.buddies;

    // Look for potential buddies based on user's courses and current buddies
    const potentialBuddies = new Set();

    // Look through buddys' buddies
    for (let buddy of userBuddies){
        const buddyInfo = await getUserInfo(buddy);
        if (!buddyInfo) {
            continue;
        }

        // Add buddy's buddies to potential buddies list if they are not already buddies and not the user
        const buddyBuddies = buddyInfo.buddies;
        for (let buddyBuddy of buddyBuddies){

            if (!userBuddies.includes(buddyBuddy.id) && buddyBuddy.id !== userId){
                potentialBuddies.add(buddyBuddy.id);
            }            
        }
    }

    // Add potential buddies who have the same classes
    const allUsers = await getAllUsers();
    for (let buddy of allUsers){
        const buddyCourses = buddy.courses;
        const similarCourses = courses.some(course => buddyCourses.includes(course));

        if (similarCourses){
            potentialBuddies.add(buddy.id);
        }


    }


    return Array.from(potentialBuddies);
}




// Test function to build algorithm until it works then move it into the updateUserOnFirestoreChange function
exports.getUserInfoHTTP = onRequest(async (req, res) => {
try {
    const userHash = "L6OWogOvbBV5ywI9B9JgMcRPOSx1";

    const userData = await getUserInfo(userHash);
    if (!userData) {
        console.error(`User ${userHash} not found in Firestore.`);
        res.status(404).json({ error: "User not found" });
        return;
    }

    const reccomendations = await reccomendBuddies(userHash);
    
    res.status(200).json(reccomendations);
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