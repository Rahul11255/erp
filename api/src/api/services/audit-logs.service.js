const db = require("../../db/db");

class AuditLogsService {
    static async listAuditLogs(user) {
        try {


            const dbQuery = db("audit_logs")
                .select(
                    "audit_logs.*",
                    "performer.id   as performed_by_id",
                    "performer.name as performed_by_name",
                    "performer.email as performed_by_email",
                    "performer.avatar as performed_by_avatar",
                    "performer.role as performed_by_role",
                    "pr.item_name",
                    "pr.status as request_status",
                    "pr.department",
                    "pr.created_by as request_created_by",
                )
                .leftJoin(
                    "users as performer",
                    "audit_logs.performed_by",
                    "performer.id"
                )
                .leftJoin(
                    "purchase_requests as pr",
                    "audit_logs.request_id",
                    "pr.id"
                )
                .orderBy("audit_logs.created_at", "desc");

            if (user.role === "EMPLOYEE") {
                // Employee — only logs for their own requests
                dbQuery.where("pr.created_by", user.id);

            }
            
            // Manager — no filter, sees all logs
            const logs = await dbQuery;

            const formattedData = logs.map((item) => ({
                id: item.id,
                action: item.action,
                from_status: item.from_status,
                to_status: item.to_status,
                remarks: item.remarks,
                created_at: item.created_at,
                request: {
                    id: item.request_id,
                    item_name: item.item_name,
                    status: item.request_status,
                    department: item.department,
                },
                performed_by: {
                    id: item.performed_by_id,
                    name: item.performed_by_name,
                    email: item.performed_by_email,
                    avatar: item.performed_by_avatar,
                    role: item.performed_by_role,
                },
            }));

            return {
                status: true,
                data: formattedData,
            };

        } catch (err) {
            console.log(err, "LIST_AUDIT_LOGS_ERROR");
            throw err;
        }
    }

}

module.exports = AuditLogsService;
