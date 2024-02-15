"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoute = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const controller_1 = require("../controller");
const router = express_1.default.Router();
exports.DeliveryRoute = router;
router.post("/signup", controller_1.DeliveryUserSignUp);
router.post("/login", controller_1.DeliveryUserLogin);
//authenticate
router.use(middleware_1.Authenticate);
router.put("/change-status", controller_1.UpdateDeliveryUserStatus);
router.get("/profile", controller_1.GetDeliveryUserProfile);
router.put("/profile", controller_1.EditDeliveryUserProfile);
//# sourceMappingURL=DeliveryRoute.js.map