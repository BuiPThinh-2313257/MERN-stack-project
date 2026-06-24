const router = require("express").Router();
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { body } = require("express-validator");

const registerRules = [
  body("name").trim().notEmpty(),
  body("username").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("role_type").isIn(["customer", "seller"]),
];

router.post("/register", registerRules, validate, register);
router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validate, login);
router.get("/me", protect, getMe);

module.exports = router;
