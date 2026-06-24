const router = require("express").Router();
const { update, remove } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /products/:productId/reviews và POST đã được mount trong product.routes.js
// File này xử lý các action trực tiếp trên review

router.put("/:id", protect, authorize("customer"), update);
router.delete("/:id", protect, authorize("customer", "admin"), remove);

module.exports = router;
