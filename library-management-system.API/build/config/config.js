"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.mongo = exports.JWT_SECRET = exports.SERVER_PORT = exports.SERVER_HOSTNAME = exports.MONGO_OPTIONS = exports.MONGO_COLLECTION = exports.MONGO_URL = exports.MONGO_PASSWORD = exports.MONGO_USER = exports.MONGO_DB = exports.PRODUCTION = exports.QA = exports.DEVELOPMENT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Add error checking for .env loading
const result = dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
if (result.error) {
    logging.log("----------------------------------------");
    logging.log("Error loading .env file:", result.error);
    logging.log("----------------------------------------");
    throw result.error;
}
// Environment flags
exports.DEVELOPMENT = process.env.NODE_ENV === "development";
exports.QA = process.env.NODE_ENV === "qa";
exports.PRODUCTION = process.env.NODE_ENV === "production";
// MongoDB connection configuration
exports.MONGO_DB = process.env.MONGO_DB;
exports.MONGO_USER = process.env.MONGO_USER;
exports.MONGO_PASSWORD = process.env.MONGO_PASSWORD;
exports.MONGO_URL = process.env.MONGO_URL;
exports.MONGO_COLLECTION = process.env.MONGO_COLLECTION;
exports.MONGO_OPTIONS = {
    retryWrites: true,
    w: "majority",
    appName: exports.MONGO_DB,
};
// Server configuration
exports.SERVER_HOSTNAME = process.env.SERVER_HOST || "localhost";
exports.SERVER_PORT = process.env.SERVER_PORT || 3000;
// JWT configuration
exports.JWT_SECRET = process.env.JWT_SECRET || "";
// Grouped MongoDB configuration
exports.mongo = {
    MONGO_USER: exports.MONGO_USER,
    MONGO_PASSWORD: exports.MONGO_PASSWORD,
    MONGO_URL: exports.MONGO_URL,
    MONGO_COLLECTION: exports.MONGO_COLLECTION,
    MONGO_OPTIONS: exports.MONGO_OPTIONS,
    MONGO_CONNECTION: `mongodb+srv://${exports.MONGO_USER}:${exports.MONGO_PASSWORD}@${exports.MONGO_URL}/${exports.MONGO_COLLECTION}`,
};
// Grouped server configuration
exports.server = {
    SERVER_HOSTNAME: exports.SERVER_HOSTNAME,
    SERVER_PORT: exports.SERVER_PORT,
};
