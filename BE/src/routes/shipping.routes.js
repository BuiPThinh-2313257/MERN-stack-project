const router = require("express").Router();
const { create, getByOrder, update } = require("../controllers/shippingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("seller", "admin"), create);
router.get("/:orderId", protect, authorize("customer", "seller", "admin"), getByOrder);
router.put("/:id", protect, authorize("seller", "admin"), update);

module.exports = router;
