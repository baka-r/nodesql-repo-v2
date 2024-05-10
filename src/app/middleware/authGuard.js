const { unAuthenticateResponse } = require("../helpers/response");

exports.authGuard = async (req, res, next) => {
    try {
        const header = req.headers['authorization'];
        if (!header) return unAuthenticateResponse(res, error);

        const token = header.includes('Bearer') ? header.split(' ')[1] : header;

        if (token != process.env.API_ACCESS_KEY) {
            return unAuthenticateResponse(res, error)
        }
        
        return next();
    } catch (error) {
        return unAuthenticateResponse(res, error)
    }
};