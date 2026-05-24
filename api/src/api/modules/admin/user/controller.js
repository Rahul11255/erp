const UserService = require('../../../services/user.service');
const Response    = require('../../../../utilities/Response');
const Message     = require('../../../../utilities/Message');

class Controller {

  static async googleLogin(req, res) {
    try {
      const response = {
        data:    {},
        message: Message.unauthorized.message,
        code:    Message.unauthorized.code,
      };

      const { token, role } = req.body;

      if (!token) {
        return Response.fail(res, {
          message: 'Google token is required',
          code:    400,
        });
      }

      const srvRes = await UserService.googleLogin(token,role);

      if (srvRes.status) {
        response.data    = srvRes.data;
        response.message = Message.dataFound.message;
        response.code    = Message.dataFound.code;
      }

      Response.success(res, response);
    } catch (err) {
      if (err.message.includes('Access denied')) {
        return Response.fail(res, {
          message: err.message,
          code:    403,
          error:   err,
        });
      }
      if (err.message.includes('Invalid Google token')) {
        return Response.fail(res, {
          message: 'Invalid or expired Google token',
          code:    401,
          error:   err,
        });
      }
      Response.fail(res, Response.createError(err));
    }
  }

  static async getMe(req, res) {
    try {
      const response = {
        data:    {},
        message: Message.noContent.message,
        code:    Message.noContent.code,
      };

      const srvRes = await UserService.getMe(req.user.id);

      if (srvRes.data?.id) {
        response.data    = srvRes.data;
        response.message = Message.dataFound.message;
        response.code    = Message.dataFound.code;
      }

      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }


  static async listUser(req, res) {
    try {
      const response = {
        data:    [],
        message: Message.noContent.message,
        code:    Message.noContent.code,
        extra:   {},
      };

      const srvRes = await UserService.listUser(req.query);

      if (srvRes.data.length) {
        response.data    = srvRes.data;
        response.message = Message.dataFound.message;
        response.code    = Message.dataFound.code;
      }

      response.extra = srvRes.extra;
      Response.success(res, response);
    } catch (err) {
      Response.fail(res, Response.createError(Message.dataFetchingError, err));
    }
  }

}

module.exports = Controller;