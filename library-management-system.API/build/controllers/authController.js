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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userModel_1 = require("../models/userModel");
const config_1 = require("../config/config");
const userValidation_1 = require("../validations/userValidation");
const mongoose_1 = __importDefault(require("mongoose"));
class AuthController {
    // User Registration Handler
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Validate user input data
                const { error, value: payload } = (0, userValidation_1.validateUser)(req.body);
                if (error) {
                    // Return validation errors if any
                    res
                        .status(400)
                        .json({ message: error.details.map((err) => err.message) });
                    return;
                }
                const { email, password } = payload;
                // const email = payload.email;
                // const password = payload.password;
                // Step 2: Check for existing user
                const existingUser = yield userModel_1.User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: "User already exists" });
                }
                // Step 3: Hash the password for security
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                // Step 4: Prepare user data with MongoDB ID
                const userData = Object.assign(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload), { password: hashedPassword });
                // Step 5: Create and save new user
                const user = new userModel_1.User(userData);
                const savedUser = yield user.save();
                // Step 6: Generate JWT token for immediate authentication
                const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET, {
                    expiresIn: "5m",
                });
                // Step 7: Send success response
                res.status(201).json({
                    message: "User created successfully",
                    token,
                    user: {
                        id: savedUser._id,
                        email: savedUser.email,
                        fullName: `${savedUser.firstName} ${savedUser.lastName}`,
                    },
                });
            }
            catch (error) {
                // Handle any unexpected errors
                res.status(500).json({ message: "Error creating user", error });
            }
        });
    }
    // User Login Handler
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Step 1: Extract credentials from request
                const { email, password } = req.body;
                // Step 2: Verify user exists
                const user = yield userModel_1.User.findOne({ email });
                if (!user) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                // Step 3: Verify password
                const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
                if (!isValidPassword) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                // Step 4: Generate access token (short-lived)
                const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET, {
                    expiresIn: "5m",
                });
                // Step 5: Generate refresh token (long-lived)
                const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET, {
                    expiresIn: "24h",
                });
                // Step 6: Send success response
                res.json({
                    message: "Login successful",
                    accessToken,
                    refreshToken,
                    user: {
                        id: user._id,
                        email: user.email,
                        fullName: `${user.firstName} ${user.lastName}`,
                        // fullName: user.firstName + " " + user.lastName,
                    },
                });
            }
            catch (error) {
                res.status(500).json({ message: "Error logging in", error });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                if (!refreshToken) {
                    return res.status(401).json({ message: "Refresh token is required" });
                }
                // Verify the refresh token
                const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.JWT_SECRET);
                // Find user
                const user = yield userModel_1.User.findById(decoded.userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Generate new access token
                const newAccessToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET, {
                    expiresIn: "5m",
                });
                // Generate new refresh token
                const newRefreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWT_SECRET, {
                    expiresIn: "24h",
                });
                res.json({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    return res.status(401).json({ message: "Refresh token has expired" });
                }
                if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    return res.status(401).json({ message: "Invalid refresh token" });
                }
                res.status(500).json({ message: "Error refreshing token", error });
            }
        });
    }
}
exports.default = new AuthController();
