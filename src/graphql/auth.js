const jwt = require("jsonwebtoken");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function getUserFromToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

// optional protection helper
function requireAuth(context) {
  if (!context.user) {
    const err = new Error("Unauthorized: missing/invalid token");
    err.code = "UNAUTHENTICATED";
    throw err;
  }
}

module.exports = { signToken, getUserFromToken, requireAuth };
