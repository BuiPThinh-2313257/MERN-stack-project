const router = require("express").Router();
const { getAll, validate, create, update, remove } = require("../controllers/voucherController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Kiểm tra voucher khi checkout (customer)
router.post("/validate", protect, authorize("customer"), validate);

// Seller quản lý vouchers
router.get("/", protect, authorize("seller", "admin"), getAll);
router.post("/", protect, authorize("seller"), create);
router.put("/:id", protect, authorize("seller"), update);
router.delete("/:id", protect, authorize("seller"), remove);

module.exports = router;
