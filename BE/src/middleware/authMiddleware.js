const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Not authorized, token invalid" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role_type)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = { protect, authorize };
