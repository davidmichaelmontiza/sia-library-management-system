"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the schema for the User model
// Schema specifies the structure and validation rules for User documents in MongoDB
exports.userSchema = new mongoose_1.Schema({
    // User email field - must be unique, required, and max 100 characters
    email: { type: String, length: 100, required: true, unique: true },
    // Password field - required and max 50 characters
    password: { type: String, length: 50, required: true },
    // First name field - required and max 50 characters
    firstName: { type: String, length: 50, required: true },
    // Last name field - required and max 50 characters
    lastName: { type: String, length: 50, required: true },
}, 
// Enable automatic timestamp fields (createdAt and updatedAt)
{ timestamps: true });
// Create and export the User model
exports.User = mongoose_1.default.model("Users", exports.userSchema);
