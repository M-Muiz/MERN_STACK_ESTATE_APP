import errorHandler  from "./error.js";
import jwt from "jsonwebtoken";


const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, "Unathorized"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(401, "Token Not Verified"));
        req.user = user;
        next();
    });
};

export default verifyToken;
