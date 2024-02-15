"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const router = express_1.default.Router();
exports.AdminRoute = router;
router.post("/vandor", controller_1.CreateVandor);
router.get("/vandors", controller_1.GetVandors);
router.get("/vandor/:id", controller_1.GetVandorById);
//transaction get
router.get("/transaction", controller_1.GetTransaction);
router.get("/transaction/:id", controller_1.GetTransactionByIDAdmin);
// delivery user
router.get("/deliveryusers", controller_1.GetDeliveryUsers);
router.get("/deliveryuser/verify", controller_1.VerifyDeliveryUser);
//# sourceMappingURL=AdminRoute.js.map