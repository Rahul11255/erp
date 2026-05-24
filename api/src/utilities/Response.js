class Response {
  static success(res, { data, message, code, extra }) {
    return res.status(200).json({
      status: true,
      code,
      message,
      data: data ?? {},
      extra: extra ?? {},
    });
  }

  static fail(res, { message, code, error }) {
    return res.status(code || 500).json({
      status: false,
      code: code || 500,
      message,
      error: error?.message || error || null,
    });
  }

  static createError(messageObj, err) {
    return {
      message: messageObj.message,
      code: messageObj.code,
      error: err,
    };
  }
}

module.exports = Response;