const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set default
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later.",
  };

  // Validation Error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate Error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for the ${Object.keys(
      err.keyValue
    )} field, please choose another value.`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Cast Error
  if (err.name === "CastError") {
    customError.msg = `No item found with the ID ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });

  //   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  // { DUPLICATE ERROR
  //     "err": {
  //         "driver": true,
  //         "name": "MongoError",
  //         "index": 0,
  //         "code": 11000,
  //         "keyPattern": {
  //             "email": 1
  //         },
  //         "keyValue": {
  //             "email": "james.wordie@lp.com"
  //         }
  //     }
  // }

  //   {  CAST ERROR
  //     "err": {
  //         "stringValue": "\"62b1e55c537fce09e5fb9825ksmef\"",
  //         "valueType": "string",
  //         "kind": "ObjectId",
  //         "value": "62b1e55c537fce09e5fb9825ksmef",
  //         "path": "_id",
  //         "reason": {},
  //         "name": "CastError",
  //         "message": "Cast to ObjectId failed for value \"62b1e55c537fce09e5fb9825ksmef\" (type string) at path \"_id\" for model \"Job\""
  //     }
  // }
};

module.exports = errorHandlerMiddleware;
