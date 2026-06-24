const router = require("express").Router();
const { create, getByOrder, updateStatus } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("customer"), create);
router.get("/:orderId", protect, authorize("customer", "admin"), getByOrder);
router.put("/:id/status", protect, authorize("admin"), updateStatus);

module.exports = router;
