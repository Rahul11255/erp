const db = require("../../db/db");

class PurchaseService {

  static async createPurchaseRequest(body, user) {

    try {

      if (user.role !== "EMPLOYEE") {
        throw {
          code: 403,
          message: "Only employees can create purchase requests",
        };
      }

      const {
        item_name,
        quantity,
        unit,
        department,
        required_date,
        justification,
        priority,
        status,
      } = body;

      if (
        !item_name ||
        !quantity ||
        !unit ||
        !department ||
        !required_date
      ) {
        throw {
          code: 400,
          message: "Please fill all required fields",
        };
      }

      const [request] = await db("purchase_requests")
        .insert({
          item_name,
          quantity,
          unit,
          department,
          required_date,
          justification,
          priority: priority || "MEDIUM",
          status: status || "SUBMITTED",
          created_by: user.id,
        })
        .returning("*");

      return {
        status: true,
        message: "Purchase request created successfully",
        data: request,
      };

    } catch (err) {

      console.log(err, "eee");

      throw err;

    }

  }

  static async listPurchaseRequests( user,query = {}) {
  try {

    const {
      status,
      department,
      priority,
      date_from,
      date_to,
    } = query;

    let dbQuery = db("purchase_requests")
      .select(
        "purchase_requests.*",
        "created_user.id     as created_by_id",
        "created_user.name   as created_by_name",
        "created_user.email  as created_by_email",
        "created_user.avatar as created_by_avatar",
        "created_user.role   as created_by_role",
        "review_user.id      as reviewed_by_id",
        "review_user.name    as reviewed_by_name",
        "review_user.email   as reviewed_by_email",
        "review_user.avatar  as reviewed_by_avatar",
        "review_user.role    as reviewed_by_role",
      )
      .leftJoin("users as created_user", "purchase_requests.created_by", "created_user.id")
      .leftJoin("users as review_user",  "purchase_requests.reviewed_by", "review_user.id");

    // ─── Role filter ──────────────────────────────
    if (user.role === "EMPLOYEE") {
      dbQuery.where("purchase_requests.created_by", user.id);
    }

    if (user.role === "MANAGER") {
      dbQuery.whereNot("purchase_requests.status", "DRAFT");
    }

    // ─── Status filter ────────────────────────────
    if (status) {
      dbQuery.where(
        "purchase_requests.status",
        status.toUpperCase()
      );
    }

    // ─── Department filter ────────────────────────
    if (department) {
      dbQuery.whereILike(
        "purchase_requests.department",
        `%${department}%`
      );
    }

    // ─── Priority filter ──────────────────────────
    if (priority) {
      dbQuery.where(
        "purchase_requests.priority",
        priority.toUpperCase()
      );
    }

    if (date_from) {
      dbQuery.where(
        "purchase_requests.required_date",
        ">=",
        new Date(date_from)
      );
    }

    if (date_to) {
      dbQuery.where(
        "purchase_requests.required_date",
        "<=",
        new Date(date_to)
      );
    }

    dbQuery.orderBy("purchase_requests.created_at", "desc");

    const requests = await dbQuery;

    const formattedData = requests.map((item) => ({
      id:            item.id,
      item_name:     item.item_name,
      quantity:      item.quantity,
      unit:          item.unit,
      department:    item.department,
      required_date: item.required_date,
      justification: item.justification,
      priority:      item.priority,
      status:        item.status,
      remarks:       item.remarks,
      created_at:    item.created_at,
      updated_at:    item.updated_at,
      created_by: {
        id:     item.created_by_id,
        name:   item.created_by_name,
        email:  item.created_by_email,
        avatar: item.created_by_avatar,
        role:   item.created_by_role,
      },
      reviewed_by: item.reviewed_by_id ? {
        id:     item.reviewed_by_id,
        name:   item.reviewed_by_name,
        email:  item.reviewed_by_email,
        avatar: item.reviewed_by_avatar,
        role:   item.reviewed_by_role,
      } : null,
    }));

    return {
      status: true,
      data:   formattedData,
    };

  } catch (err) {
    console.log(err, "LIST_ERROR");
    throw err;
  }
}

   static async updatePurchaseRequest(id, body, user) {
    try {
      const existingRequest = await db("purchase_requests")
        .where({ id })
        .first();

      if (!existingRequest) {
        throw {
          code: 404,
          message: "Purchase request not found",
        };
      }

      if (
        user.role === "EMPLOYEE" &&
        existingRequest.created_by !== user.id
      ) {
        throw {
          code: 403,
          message: "You can update only your requests",
        };
      }

      const {
        item_name,
        quantity,
        unit,
        department,
        required_date,
        justification,
        priority,
        status,
        remarks,
      } = body;

      const [updatedRequest] = await db("purchase_requests")
        .where({ id })
        .update({
          item_name,
          quantity,
          unit,
          department,
          required_date,
          justification,
          priority,
          status,
          remarks,
          updated_at: db.fn.now(),
        })
        .returning("*");

         // ✅ Write audit log ONLY if status changed
           if (status && status !== existingRequest.status) {

        // Determine action label
          let action = "updated";
          if (status === "SUBMITTED") action = "submitted";
          if (status === "APPROVED")  action = "approved";
          if (status === "REJECTED")  action = "rejected";

          await db("audit_logs").insert({
            request_id:   id,
            action:       action,
            from_status:  existingRequest.status,  // old status
            to_status:    status,                  // new status
            performed_by: user.id,
          });

        }

      return {
        status: true,
        message: "Purchase request updated successfully",
        data: updatedRequest,
      };

    } catch (err) {
      console.log(err, "UPDATE_ERROR");
      throw err;
    }
  }

  static async updatePurchaseStatus(id, body, user) {
      try {
        const { status, remarks } = body;
        if (!status) {
          throw { code: 400, message: "Status is required" };
        }

        const existingRequest = await db("purchase_requests")
          .where({ id })
          .first();

        if (!existingRequest) {
          throw { code: 404, message: "Purchase request not found" };
        }

        // Can only action SUBMITTED requests
        if (existingRequest.status !== "SUBMITTED") {
          throw { code: 400, message: "Only submitted requests can be approved or rejected" };
        }

        // Only APPROVED or REJECTED allowed here
        if (!["APPROVED", "REJECTED"].includes(status)) {
          throw { code: 400, message: "Status must be APPROVED or REJECTED" };
        }

        // Update request
        const [updatedRequest] = await db("purchase_requests")
          .where({ id })
          .update({
            status,
            remarks,
            reviewed_by: user.id,
            updated_at:  db.fn.now(),
          })
          .returning("*");

        await db("audit_logs").insert({
          request_id:   id,
          action:       status === "APPROVED" ? "approved" : "rejected",
          from_status:  existingRequest.status,  
          to_status:    status,                  
          performed_by: user.id,
        });

        return {
          status:  true,
          message: `Purchase request ${status.toLowerCase()} successfully`,
          data:    updatedRequest,
        };

      } catch (err) {
        console.log(err, "UPDATE_STATUS_ERROR");
        throw err;
      }
    }
}

module.exports = PurchaseService;