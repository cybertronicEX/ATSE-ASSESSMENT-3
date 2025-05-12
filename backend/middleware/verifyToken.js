// middlewares/verifyToken.js
const { admin } = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // uid, email, etc.
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid Firebase token" });
  }
};

module.exports = verifyToken;
