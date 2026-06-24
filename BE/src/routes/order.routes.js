const router = require("express").Router();
const { createOrder, getOrders, getOne, updateStatus } = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", authorize("customer"), createOrder);
router.get("/", authorize("customer", "seller", "admin"), getOrders);
router.get("/:id", authorize("customer", "seller", "admin"), getOne);
router.put("/:id/status", authorize("customer", "seller", "admin"), updateStatus);

module.exports = router;
