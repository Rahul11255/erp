const DashboardService = require("../../../services/dashboard.service");
const Response = require("../../../../utilities/Response");
const Message = require("../../../../utilities/Message");

class Controller {

static async getDashboardStats(req, res) {
  try {
    const response = {
      data:    {},
      message: Message.noContent.message,
      code:    Message.noContent.code,
    };

    const srvRes = await DashboardService.getDashboardStats(req.user);

    if (srvRes.status) {
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