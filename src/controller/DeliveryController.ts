import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CartItem,
  CreateCustomerInput,
  CreateDeliveryUserInput,
  EditCustomerProfileInput,
  LoginCustomerInput,
  OrderInput,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import {
  GenerateOTP,
  GeneratePassword,
  GenerateSignature,
  Generatesalt,
  ValidatePassword,
  onRequestOTP,
} from "../utility";
import { Customer } from "../models/Customer";
import { DeliveryUser } from "../models";

export const DeliveryUserSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inputdata = plainToClass(CreateDeliveryUserInput, req.body);

  const inputvalidate = await validate(inputdata, {
    validationError: { target: true },
  });

  if (inputvalidate.length > 0) {
    return res.status(400).json(inputvalidate);
  }

  const { email, phone, password, firstName, lastName, address, pincode } =
    inputdata;

  const salt = await Generatesalt();
  const passwordGenerate = await GeneratePassword(password, salt);

  const existingCust = await DeliveryUser.findOne({ email: email });
  if (existingCust != null) {
    return res.status(409).json({ message: "Delivery User already exist" });
  }

  const result = await DeliveryUser.create({
    email: email,
    password: passwordGenerate,
    phone: phone,
    salt: salt,
    firstName: firstName,
    lastName: lastName,
    address: address,
    verified: false,
    pincode: pincode,
    lat: 0,
    lng: 0,
    isAvailable: false,
  });

  if (result) {
    //request otp using twilio
    //  await onRequestOTP(otp,phone);

    // generate signature
    const signatureGen = await GenerateSignature({
      _id: result._id,
      email: result.email,
      verified: result.verified,
    });
    //send result to client
    return res.status(200).json({
      signature: signatureGen,
      email: result.email,
      verified: result.verified,
    });
  }
  return res.status(400).json({ message: "Error with sign up" });
};

export const DeliveryUserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginData = plainToClass(LoginCustomerInput, req.body);
  let validation = await validate(loginData, {
    validationError: { target: true },
  });

  if (validation.length > 0) {
    return res.status(400).json(validate);
  }

  const { email, password } = loginData;
  const oneuser = await DeliveryUser.findOne({ email: email });
  if (oneuser != null) {
    const validatepassword = await ValidatePassword(
      password,
      oneuser.password,
      oneuser.salt
    );
    if (validatepassword) {
      const signatureGen = await GenerateSignature({
        _id: oneuser._id,
        email: oneuser.email,
        verified: oneuser.verified,
      });
      //send result to client
      return res.status(200).json({
        signature: signatureGen,
        email: oneuser.email,
        verified: oneuser.verified,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Delivery User Password Mismatched" });
    }
  }
  return res.status(400).json({ message: "Delivery User not found" });
};

export const GetDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await DeliveryUser.findById(user._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with fetch profile" });
};

export const EditDeliveryUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const editdata = plainToClass(EditCustomerProfileInput, req.body);

  let validationprofile = await validate(editdata, {
    validationError: { target: true },
  });
  let { firstName, lastName, address } = editdata;
  if (validationprofile) {
    const user = req.user;

    if (user) {
      const profile = await DeliveryUser.findById(user._id);

      if (profile) {
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;

        await profile.save();

        return res.status(200).json(profile);
      }
    }
  }
  return res.status(400).json({ message: "Error with fetch profile" });
};

export const UpdateDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { lat, lng } = req.body;
  if (user) {
    const deliveryuser = await DeliveryUser.findById(user._id);

    if (deliveryuser) {
      deliveryuser.isAvailable = !deliveryuser.isAvailable;
      if (lat && lng) {
        deliveryuser.lat = lat;
        deliveryuser.lng = lng;
      }
      await deliveryuser.save();

      return res.status(200).json(deliveryuser);
    }
  }
};
