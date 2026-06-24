const router = require("express").Router();

router.use("/auth",          require("./auth.routes"));
router.use("/categories",    require("./category.routes"));
router.use("/subcategories", require("./subCategory.routes"));
router.use("/products",      require("./product.routes"));
router.use("/addresses",     require("./address.routes"));
router.use("/cart",          require("./cart.routes"));
router.use("/orders",        require("./order.routes"));
router.use("/reviews",       require("./review.routes"));
router.use("/vouchers",      require("./voucher.routes"));
router.use("/payments",      require("./payment.routes"));
router.use("/shipping",      require("./shipping.routes"));

module.exports = router;
