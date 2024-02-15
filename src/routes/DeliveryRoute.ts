import express from "express";
import { Authenticate } from "../middleware";
import {
  DeliveryUserLogin,
  DeliveryUserSignUp,
  EditDeliveryUserProfile,
  GetDeliveryUserProfile,
  UpdateDeliveryUserStatus,
} from "../controller";

const router = express.Router();

router.post("/signup", DeliveryUserSignUp);
router.post("/login", DeliveryUserLogin);

//authenticate
router.use(Authenticate);

router.put("/change-status", UpdateDeliveryUserStatus);
router.get("/profile", GetDeliveryUserProfile);
router.put("/profile", EditDeliveryUserProfile);

export { router as DeliveryRoute };
