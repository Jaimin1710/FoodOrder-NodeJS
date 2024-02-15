"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.post("/signup", controller_1.CustomerSignUp);
router.post("/login", controller_1.CustomerLogin);
//authenticate
router.use(middleware_1.Authenticate);
router.patch("/verify", controller_1.CustomerVerify);
router.get("/otp", controller_1.RequestOTP);
router.get("/profile", controller_1.GetCustomerProfile);
router.patch("/profile", controller_1.EditCustomerProfile);
//order
router.post("/createorder", controller_1.CreateOrders);
router.get("/orders", controller_1.GetOrders);
router.get("/order/:id", controller_1.GetOrderByID);
//cart
router.post("/cart", controller_1.AddToCart);
router.get("/cart", controller_1.GetCart);
router.delete("/cart", controller_1.DeleteCart);
//offer verify
router.get("/offer/verify/:id", controller_1.Verifyoffer);
//payment
router.post("/create-payment", controller_1.CreatePayment);
//# sourceMappingURL=CustomerRoute.js.map