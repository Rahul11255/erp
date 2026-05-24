const { Router } = require('express');
const DashboardStats = require("./controller");

const router = Router({ mergeParams: true });
const { protect } = require("../../../middlewares/user");

router.get("/details", protect, DashboardStats.getDashboardStats);


module.exports = router;