const router = require("express").Router();
const { getAll, getOne, create, update, remove } = require("../controllers/subCategoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public — hỗ trợ filter ?category=<id>
router.get("/", getAll);
router.get("/:id", getOne);

// Admin only
router.post("/", protect, authorize("admin"), create);
router.put("/:id", protect, authorize("admin"), update);
router.delete("/:id", protect, authorize("admin"), remove);

module.exports = router;
