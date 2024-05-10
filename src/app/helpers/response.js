// These functions are accrosed the project frequently
exports.handleResponse = (res, error) => {
    const { statusCode, ...response } = error;
    return res.status(statusCode).json({ ...response });
};

exports.InternalServerError = (res, error) => {
    const errorResponse = { error: { statusCode: 500, status: false, message: "We encountered an issue while processing your request. Please try again later or contact support if the problem persists", error: error?.message } }
    return exports.handleResponse(res, errorResponse?.error)
}

exports.unAuthenticateResponse = (res, error) => {
    const errorResponse = { error: { statusCode: 401, status: false, message: "Cant Proceed, because you are Unauthorized." } }
    return exports.handleResponse(res, errorResponse?.error)
}

exports.successfulResponse = (res, data) => {
    const response = { message: { statusCode: 200, status: true, ...data } }
    return exports.handleResponse(res, response?.message)
}

exports.createResponse = (res, data) => {
    const response = { message: { statusCode: 201, status: true, ...data } }
    return exports.handleResponse(res, response?.message)
}

exports.notFoundResponse = (res, data) => {
    const response = { message: { statusCode: 404, status: false, ...data } }
    return exports.handleResponse(res, response?.message)
}