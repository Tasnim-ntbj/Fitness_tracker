const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(403)
      .json({ success: false, message: "JWT token is required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Token format invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user profile information summary directly onto the request sequence
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "JWT token is invalid or expired" });
  }
};

module.exports = ensureAuthenticated;
