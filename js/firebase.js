const firebaseConfig = {
  apiKey: "AIzaSyCZrLnHQhRTfl8xZtt7k_oRszH6EUGfpN0",
  authDomain: "climber-5e1f9.firebaseapp.com",
  projectId: "climber-5e1f9",
  storageBucket: "climber-5e1f9.firebasestorage.app",
  messagingSenderId: "452762324964",
  appId: "1:452762324964:web:1bb164e502c841479b01f1",
  measurementId: "G-VYLFMZ1NHM",
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ------------------------------
// 2. Generate Random Username (name + 4-digit)
// ------------------------------
function generateUsername() {
  const names = ["Player", "Gamer", "Runner", "Climber", "Hero"];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return randomName + number;
}
// ------------------------------
// 3. Create User If Needed
// ------------------------------
function createUserIfNeeded() {
  let userId = localStorage.getItem("userId");

  if (userId) return; // already exists

  userId = "user_" + Date.now();
  const username = generateUsername();

  // Store locally first
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
  console.log("Local user created:", username);

  // Then try Firestore (optional, will fail if rules block)
  db.collection("players")
    .doc(userId)
    .set({
      username,
      highScore: parseInt(localStorage.getItem("highScore")) || 0,
      createdAt: Date.now(),
    })
    .then(() => {
      console.log("User added to Firestore");
    })
    .catch((err) => {
      console.warn("Firestore write failed (can ignore for now):", err);
    });
}

// ------------------------------
// 4. Update High Score
// ------------------------------
async function updatehighScore(score) {
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  const localHighScore = Number(localStorage.getItem("highScore")) || 0;
  try {
    const docRef = db.collection("players").doc(userId);
    const snap = await docRef.get();

    if (snap.exists) {
      const firebaseHighScore = Number(snap.data().highScore) || 0;

      if (localHighScore > firebaseHighScore) {
        // Update Firebase with localStorage score
        await docRef.set({ highScore: localHighScore }, { merge: true });
        console.log("Firebase updated from localStorage:", localHighScore);
      } else if (firebaseHighScore > localHighScore) {
        // Update localStorage if Firebase score is higher
        localStorage.setItem("highScore", firebaseHighScore);
        console.log("localStorage updated from Firebase:", firebaseHighScore);
      }
    } else {
      // If document somehow doesn't exist, create it
      await docRef.set({ highScore: localHighScore }, { merge: true });
      console.log(
        "Firebase doc created with localStorage score:",
        localHighScore
      );
    }
  } catch (err) {
    console.warn("Firebase sync failed (user offline?):", err);
  }
}
