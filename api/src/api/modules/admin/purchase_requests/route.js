const { Router } = require('express');
const PurchaseController = require("./controller");

const router = Router({ mergeParams: true });
const { protect, managerOnly } = require("../../../middlewares/user");

router.post("/create", protect, PurchaseController.createPurchaseRequest);
router.get("/list", protect, PurchaseController.listPurchaseRequests);
router.put("/update/:id",protect,PurchaseController.updatePurchaseRequest);
router.put( "/update-status/:id",protect,managerOnly,PurchaseController.updatePurchaseStatus);

module.exports = router;