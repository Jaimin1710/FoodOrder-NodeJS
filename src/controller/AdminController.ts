import { Request, Response, NextFunction } from "express";
import { CreateVandorInput } from "../dto";
import { DeliveryUser, Vandor } from "../models";
import { GeneratePassword, Generatesalt } from "../utility";
import { Transaction } from "../models/Transaction";

export const FindOneVandor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vandor.findOne({ email: email });
  } else {
    return await Vandor.findById(id);
  }
};

export const CreateVandor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    address,
    pincode,
    ownerName,
    phone,
    foodType,
    email,
    password,
  } = <CreateVandorInput>req.body;

  const checkEmail = await FindOneVandor("", email);
  if (checkEmail != null) {
    return res.json({ message: "User Exist" });
  }
  // generate salt
  const salt = await Generatesalt();
  // encrpt password using salt
  const userPassword = await GeneratePassword(password, salt);

  const createVandor = await Vandor.create({
    name: name,
    address: address,
    pincode: pincode,
    ownerName: ownerName,
    phone: phone,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
    lat: 0,
    lng: 0,
  });
  return res.json(createVandor);
};

export const GetVandors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = await Vandor.find();
  if (data != null) {
    return res.json(data);
  }
  return res.json({ message: "Data not found" });
};

export const GetVandorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  //console.log('id'+id);
  /* const data = await FindOneVandor(id);
    if(data!=null)
    {  
        return res.json(data);
    }
    
    return res.json({'message':'Data not found'});*/

  Vandor.findById(id)
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => {
      return res.json({ err: err });
    });
};

export const GetTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const alltransaction = await Transaction.find();
  if (alltransaction) {
    return res.status(200).json(alltransaction);
  }

  return res.status(400).json({ message: "No Transaction History" });
};

export const GetTransactionByIDAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id = req.params.id;
  const alltransaction = await Transaction.findById(id);
  if (alltransaction) {
    return res.status(200).json(alltransaction);
  }

  return res.status(400).json({ message: "No Transaction History" });
};

export const GetDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const alluser = await DeliveryUser.find();
  if (alluser) {
    return res.status(200).json(alluser);
  }

  return res.status(400).json({ message: "No User History" });
};

export const VerifyDeliveryUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id, status } = req.body;

  const alluser = await DeliveryUser.findById(_id);
  if (alluser) {
    alluser.verified = status;
    await alluser.save();
    return res.status(200).json(alluser);
  }

  return res
    .status(400)
    .json({ message: "error in update delivery user verification" });
};
