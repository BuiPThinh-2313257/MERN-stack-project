const router = require("express").Router();
const { getAll, getOne, create, update, remove } = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", protect, authorize("admin"), create);
router.put("/:id", protect, authorize("admin"), update);
router.delete("/:id", protect, authorize("admin"), remove);

module.exports = router;
