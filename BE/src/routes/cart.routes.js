const router = require("express").Router();
const { getMyCart, addItem, updateItem, removeItem, clearCart } = require("../controllers/cartController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Customer only
router.use(protect, authorize("customer"));

router.get("/", getMyCart);
router.delete("/", clearCart);
router.post("/items", addItem);
router.put("/items/:itemId", updateItem);
router.delete("/items/:itemId", removeItem);

module.exports = router;
