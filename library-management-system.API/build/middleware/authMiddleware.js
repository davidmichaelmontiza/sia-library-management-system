"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        // Extract the token from the Authorization header
        // Format: "Bearer <token>"
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        // If no token is provided, return 401 Unauthorized
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }
        // Verify the token using JWT_SECRET and cast the result to JwtPayload type
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        // Add the userId from the decoded token to the request object
        // This makes the userId available to subsequent middleware and route handlers
        req.userId = decoded.userId;
        // Continue to the next middleware or route handler
        next();
    }
    catch (error) {
        // If token verification fails, return 401 Unauthorized
        res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
