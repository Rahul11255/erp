const db = require("../../db/db");

class DashboardStats {
    static async getDashboardStats(user) {
        try {

            const isManager = user.role === "MANAGER";

            const userFilter = isManager
                ? {}
                : { created_by: user.id };

            const [counts] = await db("purchase_requests")
                .where(userFilter)
                .select([
                    db.raw("COUNT(*) as total"),
                    db.raw("COUNT(*) FILTER (WHERE status = 'SUBMITTED') as pending"),
                    db.raw("COUNT(*) FILTER (WHERE status = 'APPROVED')  as approved"),
                    db.raw("COUNT(*) FILTER (WHERE status = 'REJECTED')  as rejected"),
                    db.raw("COUNT(*) FILTER (WHERE status = 'DRAFT')     as draft"),
                ]);

            const activityQuery = db("audit_logs")
                .select(
                    "audit_logs.id",
                    "audit_logs.action",
                    "audit_logs.from_status",
                    "audit_logs.to_status",
                    "audit_logs.created_at",
                    "performer.id     as performed_by_id",
                    "performer.name   as performed_by_name",
                    "performer.email  as performed_by_email",
                    "performer.avatar as performed_by_avatar",
                    "performer.role   as performed_by_role",
                    "pr.id            as request_id",
                    "pr.item_name",
                    "pr.department",
                    "pr.status        as request_status",
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
                .orderBy("audit_logs.created_at", "desc")
                .limit(10);

            // Employee — only activity on their own requests
            if (!isManager) {
                activityQuery.where("pr.created_by", user.id);
            }

            const recentActivity = await activityQuery;

            const formattedActivity = recentActivity.map((item) => ({
                id: item.id,
                action: item.action,
                from_status: item.from_status,
                to_status: item.to_status,
                created_at: item.created_at,
                request: {
                    id: item.request_id,
                    item_name: item.item_name,
                    department: item.department,
                    status: item.request_status,
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
                data: {
                    stats: {
                        total: parseInt(counts.total),
                        pending: parseInt(counts.pending),
                        approved: parseInt(counts.approved),
                        rejected: parseInt(counts.rejected),
                        draft: parseInt(counts.draft),
                    },
                    recent_activity: formattedActivity,
                },
            };

        } catch (err) {
            console.log(err, "DASHBOARD_ERROR");
            throw err;
        }
    }

}

module.exports = DashboardStats;
