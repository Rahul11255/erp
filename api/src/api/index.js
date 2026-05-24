const userRoutes = require('./modules/admin/user/route');
const purchaseRoutes = require('./modules/admin/purchase_requests/route');
const auditLogs = require('./modules/admin/audit-logs/route');
const dashboardRoutes = require('./modules/admin/dashboard/route');

const api = (app) =>{
 app.use("/admin/users",userRoutes)
 app.use("/admin/purchase",purchaseRoutes)
 app.use("/admin/audit-logs",auditLogs)
 app.use("/admin/dashboard",dashboardRoutes)

}

module.exports = api;
