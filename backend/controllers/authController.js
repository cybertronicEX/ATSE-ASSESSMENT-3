const { admin, db } = require('../config/firebase');

exports.signUpWithEmail = async (req, res) => {
  const { email, password, username, role } = req.body;

  if (!email || !password || !username || !role) {
    return res.status(400).json({ error: "All fields (email, password, username, role) are required" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    await db.collection('users').doc(userRecord.uid).set({
      email,
      username,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Generate custom token
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
