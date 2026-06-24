const router = require("express").Router();
const { getMyAddresses, create, update, remove } = require("../controllers/addressController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Customer only — tất cả đều cần đăng nhập
router.use(protect, authorize("customer"));

router.get("/", getMyAddresses);
router.post("/", create);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
