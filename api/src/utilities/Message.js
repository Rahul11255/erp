const Message = {
  dataFound: { message: "Data found", code: 200 },
  noContent: { message: "No content", code: 204 },
  dataSaved: { message: "Data saved successfully", code: 200 },
  dataDeleted: { message: "Data deleted successfully", code: 200 },
  dataUpdated: { message: "Data updated successfully", code: 200 },
  badRequest: { message: "Bad request", code: 400 },
  unauthorized: { message: "Unauthorized", code: 401 },
  forbidden: { message: "Forbidden", code: 403 },
  notFound: { message: "Data not found", code: 404 },
  internalServerError: { message: "Internal server error", code: 500 },
  dataFetchingError: { message: "Error while fetching data", code: 500 },
  dataDeletionError: { message: "Error while deleting data", code: 500 },
};

module.exports = Message;