"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shutdown = exports.Main = exports.httpServer = exports.application = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
require("./config/logging");
const config_1 = require("./config/config");
require("reflect-metadata");
const corsHandler_1 = require("./middleware/corsHandler");
const loggingHandler_1 = require("./middleware/loggingHandler");
const routeNotFound_1 = require("./middleware/routeNotFound");
const swagger_1 = require("./config/swagger");
const bookRoutes_1 = __importDefault(require("./routes/bookRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const fineRoutes_1 = __importDefault(require("./routes/fineRoutes"));
const shelfRoutes_1 = __importDefault(require("./routes/shelfRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
exports.application = (0, express_1.default)();
const Main = () => __awaiter(void 0, void 0, void 0, function* () {
    logging.log("----------------------------------------");
    logging.log("Initializing API");
    logging.log("----------------------------------------");
    exports.application.use(express_1.default.urlencoded({ extended: true }));
    exports.application.use(express_1.default.json());
    logging.log("----------------------------------------");
    logging.log("Swagger UI");
    logging.log("----------------------------------------");
    exports.application.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Your API Documentation",
    }));
    logging.log("----------------------------------------");
    logging.log("Connect to Mongo");
    logging.log("----------------------------------------");
    try {
        const connection = yield mongoose_1.default.connect(config_1.mongo.MONGO_CONNECTION, config_1.mongo.MONGO_OPTIONS);
        logging.log("----------------------------------------");
        logging.log("Connected to Mongo: ", connection.version);
        logging.log("----------------------------------------");
    }
    catch (error) {
        logging.log("----------------------------------------");
        logging.error(error);
        logging.error("Unable to connect to Mongo");
        logging.log("----------------------------------------");
    }
    logging.log("----------------------------------------");
    logging.log("Logging & Configuration");
    logging.log("----------------------------------------");
    exports.application.use(loggingHandler_1.loggingHandler);
    exports.application.use(corsHandler_1.corsHandler);
    logging.log("----------------------------------------");
    logging.log("Define Controller Routing");
    logging.log("----------------------------------------");
    exports.application.use(bookRoutes_1.default);
    exports.application.use(categoryRoutes_1.default);
    exports.application.use(fineRoutes_1.default);
    exports.application.use(shelfRoutes_1.default);
    exports.application.use(transactionRoutes_1.default);
    logging.log("----------------------------------------");
    logging.log("Define Routing Error");
    logging.log("----------------------------------------");
    exports.application.use(routeNotFound_1.routeNotFound);
    logging.log("----------------------------------------");
    logging.log("Starting Server");
    logging.log("----------------------------------------");
    exports.httpServer = http_1.default.createServer(exports.application);
    exports.httpServer.listen(config_1.server.SERVER_PORT, () => {
        logging.log("----------------------------------------");
        logging.log(`Server started on ${config_1.server.SERVER_HOSTNAME}:${config_1.server.SERVER_PORT}`);
        logging.log("----------------------------------------");
    });
});
exports.Main = Main;
const Shutdown = (callback) => exports.httpServer && exports.httpServer.close(callback);
exports.Shutdown = Shutdown;
(0, exports.Main)();
