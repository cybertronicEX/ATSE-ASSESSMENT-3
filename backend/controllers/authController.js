const { admin, db } = require('../config/firebase');

exports.signUpWithEmail = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const userRecord = await admin.auth().createUser({ email, password, displayName: username });
    await db.collection('users').doc(userRecord.uid).set({ email, username });


    // Generate a custom token using the user's uid
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(201).json({ token: customToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginWithEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    // Get the user record from Firebase using the email
    const userRecord = await admin.auth().getUserByEmail(email);
    // Generate a custom token using the user's uid
    const customToken = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).json({ token: customToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.signInWithGoogle = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the Google-issued ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    // Get the Google user's display name if available
    const displayName = decodedToken.name || null;

    // Check if a user document exists in Firestore
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      // Create a new document with email and username (using displayName)
      await userRef.set({ email, username: displayName || "" });
    } else if (!doc.data().username && displayName) {
      // Optionally update username if it's not set
      await userRef.update({ username: displayName });
    }

    const existingUserRecord = await admin.auth().getUser(uid);

    if (!existingUserRecord.displayName && displayName) {
      await admin.auth().updateUser(uid, { displayName });
    }

    // Generate a custom token for the Google user
    const customToken = await admin.auth().createCustomToken(uid);

    res.status(200).json({ token: customToken, email });
  } catch (error) {
    res.status(401).json({ error: 'Invalid Google ID token' });
  }
};
