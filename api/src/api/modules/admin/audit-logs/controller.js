const AuditLogsService = require("../../../services/audit-logs.service");
const Response = require("../../../../utilities/Response");
const Message = require("../../../../utilities/Message");

class Controller {

static async listAuditLogs(req, res) {
  try {
    const response = {
      data:    [],
      message: Message.noContent.message,
      code:    Message.noContent.code,
      extra:   {},
    };

    const srvRes = await AuditLogsService.listAuditLogs(
      req.query,
      req.user
    );

    if (srvRes.data.length) {
      response.data    = srvRes.data;
      response.message = Message.dataFound.message;
      response.code    = Message.dataFound.code;
    }

    Response.success(res, response);

  } catch (err) {
    Response.fail(res, Response.createError(Message.dataFetchingError, err));
  }
}

}

module.exports = Controller;