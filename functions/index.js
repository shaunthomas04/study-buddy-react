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
    const userRef = db.collection("users").doc(userId.trim());  
    const docSnapshot = await userRef.get();
    return docSnapshot.exists ? docSnapshot.data() : null;
}

// Function to update buddySuggestions field for user in Firestore
const updateBuddySuggestions = async (userId, buddySuggestions) => {
    const userRef = db.collection("users").doc(userId.trim());
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
        console.log(`User ${userId} not found in Firestore.`);
        return;
    }

    await userRef.update({ buddySuggestions });
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
    const userCourses = userInfo.courses; // Array of course codes
    const userBuddies = userInfo.buddies;

    // Look for potential buddies based on user's courses and current buddies
    const potentialBuddies = new Set();

    // Look through buddys' buddies (working)
    for (let buddy of userBuddies){
        const buddyInfo = await getUserInfo(buddy);
        if (!buddyInfo) {
            continue;
        }

        // Add buddy's buddies to potential buddies list if they are not already buddies and not the user
        const buddyBuddies = buddyInfo.buddies;
        for (let buddyID of buddyBuddies){
            if (!userBuddies.includes(buddyID) && buddyID !== userId){
                potentialBuddies.add(buddyID);
            }            
        }
    }

    // Add potential buddies who have the same classes

    // Gets all users with similar courses, and adds them to the potential buddies
    // Need to figure out how to prevent current buddies from being added
    const allUsers = await getAllUsers();

    for (let buddy of allUsers){
      const buddyCourses = buddy.courses;
      const similarCourses = userCourses.some(course => buddyCourses.includes(course));
      const isCurrentlyBuddy = userBuddies.includes(` ${buddy.id}`);

        if (similarCourses && buddy.id.trim() !== userId.trim() && !isCurrentlyBuddy){
            potentialBuddies.add(buddy.id.trim()); 
        }
    }

   

    return Array.from(potentialBuddies);
}

// Function to reccomend buddies to a user that can be used in either the HTTP function or the Firestore function
const reccomendBuddiesAlgorithm = async (userHash) => {
  const userData = await getUserInfo(userHash);
    if (!userData) {
        console.error(`User ${userHash} not found in Firestore.`);
        return;
    }

    // const reccomendations = await reccomendBuddies(userHash);
    const buddiesReccomendations = await reccomendBuddies(userHash);
    if (buddiesReccomendations.length > 10){
        buddiesReccomendations = buddiesReccomendations.slice(0, 10);
    }

    await updateBuddySuggestions(userHash, buddiesReccomendations);
}




// Test function to build algorithm until it works then move it into the updateUserOnFirestoreChange function
exports.getUserInfoHTTP = onRequest({ timeoutSeconds: 120 }, async (req, res) => {
try {
    const userHash = "L6OWogOvbBV5ywI9B9JgMcRPOSx1";
    await reccomendBuddiesAlgorithm(userHash);
    res.status(200).json({ message: "User info fetched successfully." });
} 
catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user: " + error.message });
}
});



// Function to update user's buddy suggestions when user document is updated
exports.updateUserOnFirestoreChange = onDocumentUpdated(
  "users/{userId}",
  async (event) => {
    try {
      const userId = event.params.userId;
      await reccomendBuddiesAlgorithm(userId);  
      logger.log(`Buddy suggestions updated for user ${userId}`);
    } 
    catch (error) {
      logger.error("Error updating user on Firestore change:", error);
    }
  }
);