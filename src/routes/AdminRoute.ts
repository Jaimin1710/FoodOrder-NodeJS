import express from "express";
import {
  CreateVandor,
  GetVandors,
  GetVandorById,
  GetTransaction,
  GetTransactionByIDAdmin,
  GetDeliveryUsers,
  VerifyDeliveryUser,
} from "../controller";

const router = express.Router();

router.post("/vandor", CreateVandor);
router.get("/vandors", GetVandors);
router.get("/vandor/:id", GetVandorById);

//transaction get

router.get("/transaction", GetTransaction);
router.get("/transaction/:id", GetTransactionByIDAdmin);

// delivery user

router.get("/deliveryusers", GetDeliveryUsers);
router.get("/deliveryuser/verify", VerifyDeliveryUser);

export { router as AdminRoute };
