import express from "express";
import {
  CreateOrders,
  CustomerLogin,
  CustomerSignUp,
  CustomerVerify,
  DeleteCart,
  EditCustomerProfile,
  GetCart,
  GetCustomerProfile,
  GetOrderByID,
  GetOrders,
  RequestOTP,
  AddToCart,
  Verifyoffer,
  CreatePayment,
} from "../controller";
import { Authenticate } from "../middleware";

const router = express.Router();

router.post("/signup", CustomerSignUp);
router.post("/login", CustomerLogin);

//authenticate
router.use(Authenticate);
router.patch("/verify", CustomerVerify);
router.get("/otp", RequestOTP);
router.get("/profile", GetCustomerProfile);
router.patch("/profile", EditCustomerProfile);

//order
router.post("/createorder", CreateOrders);
router.get("/orders", GetOrders);
router.get("/order/:id", GetOrderByID);
//cart

router.post("/cart", AddToCart);
router.get("/cart", GetCart);
router.delete("/cart", DeleteCart);

//offer verify
router.get("/offer/verify/:id", Verifyoffer);
//payment
router.post("/create-payment", CreatePayment);

export { router as CustomerRoute };
