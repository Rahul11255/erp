const PurchaseService = require("../../../services/purchase-request.service");

const Response = require("../../../../utilities/Response");

const Message = require("../../../../utilities/Message");

class Controller {

  static async createPurchaseRequest(req, res) {

    try {

      const response = {
        data: {},
        message: Message.noContent.message,
        code: Message.noContent.code,
      };

      const srvRes =
        await PurchaseService.createPurchaseRequest(
          req.body,
          req.user
        );

      if (srvRes.status) {

        response.data = srvRes.data;
        response.message = srvRes.message;
        response.code = Message.dataSaved.code;

      }

      Response.success(res, response);

    } catch (err) {

      if (
        err.message?.includes("Only employees")
      ) {

        return Response.fail(res, {
          message: err.message,
          code: 403,
          error: err,
        });

      }

      if (
        err.message?.includes("Please fill")
      ) {

        return Response.fail(res, {
          message: err.message,
          code: 400,
          error: err,
        });

      }

      Response.fail(
        res,
        Response.createError(err)
      );

    }

  }

  static async updatePurchaseRequest(req, res) {

  try {

    const response = {
      data: {},
      message: Message.noContent.message,
      code: Message.noContent.code,
    };

    const srvRes =
      await PurchaseService.updatePurchaseRequest(
        req.params.id,
        req.body,
        req.user
      );

    if (srvRes.status) {

      response.data = srvRes.data;
      response.message = srvRes.message;
      response.code = Message.dataUpdated.code;

    }

    Response.success(res, response);

  } catch (err) {

    if (
      err.message?.includes("not found")
    ) {

      return Response.fail(res, {
        message: err.message,
        code: 404,
        error: err,
      });

    }

    if (
      err.message?.includes("only your requests")
    ) {

      return Response.fail(res, {
        message: err.message,
        code: 403,
        error: err,
      });

    }

    Response.fail(
      res,
      Response.createError(err)
    );

  }

  }
   
  static async updatePurchaseStatus(req, res) {
  try {

    const response = {
      data: {},
      message: Message.noContent.message,
      code: Message.noContent.code,
    };
    const srvRes = await PurchaseService.updatePurchaseStatus(
      req.params.id,
      req.body,
      req.user
    );

    if (srvRes.status) {
      response.data = srvRes.data;
      response.message = srvRes.message;
      response.code = Message.dataUpdated.code;
    }
    Response.success(res, response);
  } catch (err) {
    Response.fail(
      res,
      Response.createError(err)
    );
  }
  }

  
  static async listPurchaseRequests(req, res) {

    try {

      const response = {
        data: [],
        message: Message.noContent.message,
        code: Message.noContent.code,
      };
 
      const srvRes =
        await PurchaseService.listPurchaseRequests(
          req.user,req.query 
        );

      if (srvRes.data.length) {

        response.data = srvRes.data;
        response.message = Message.dataFound.message;
        response.code = Message.dataFound.code;

      }

      Response.success(res, response);

    } catch (err) {

      Response.fail(
        res,
        Response.createError(
          Message.dataFetchingError,
          err
        )
      );

    }

  }

}

module.exports = Controller;