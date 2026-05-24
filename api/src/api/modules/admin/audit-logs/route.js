const { Router } = require('express');
const AuditLogs = require("./controller");

const router = Router({ mergeParams: true });
const { protect } = require("../../../middlewares/user");

router.get("/list", protect, AuditLogs.listAuditLogs);


module.exports = router;