const router = require("express").Router();
const { getAll, getOne, create, update, remove } = require("../controllers/productController");
const { getByProduct, create: createVariant, update: updateVariant, remove: removeVariant } = require("../controllers/variantController");
const { getByProduct: getReviews, create: createReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public
router.get("/", getAll);               // ?search=&sub_category=&seller=&page=&limit=
router.get("/:id", getOne);

// Seller only
router.post("/", protect, authorize("seller"), create);
router.put("/:id", protect, authorize("seller"), update);
router.delete("/:id", protect, authorize("seller"), remove);

// Variants (nested)
router.get("/:productId/variants", getByProduct);
router.post("/:productId/variants", protect, authorize("seller"), createVariant);
router.put("/variants/:id", protect, authorize("seller"), updateVariant);
router.delete("/variants/:id", protect, authorize("seller"), removeVariant);

// Reviews (nested)
router.get("/:productId/reviews", getReviews);
router.post("/:productId/reviews", protect, authorize("customer"), createReview);

module.exports = router;
