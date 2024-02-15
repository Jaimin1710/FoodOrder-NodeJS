import { Request, Response, NextFunction } from "express";
import { CreateOfferInput, EditVandorInputs, VandorLoginInputs } from "../dto";
import { FindOneVandor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { Food, Offer } from "../models";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Order } from "../models/Order";

export const VandorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VandorLoginInputs>req.body;

  const checkEmail = await FindOneVandor("", email);

  if (checkEmail != null) {
    const validating = await ValidatePassword(
      password,
      checkEmail.password,
      checkEmail.salt
    );
    if (validating) {
      const signature = GenerateSignature({
        email: checkEmail.email,
        _id: checkEmail._id,
        foodType: checkEmail.foodType,
        name: checkEmail.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Login password is invalid" });
    }
  }
  return res.json({ message: "User not found" });
};

export const GetVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingUser = await FindOneVandor(user._id);
    return res.json(existingUser);
  }
  return res.json({ message: "Vandor not found" });
};

export const UpdateVandorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, phone, foodType } = <EditVandorInputs>req.body;
  const user = req.user;
  if (user) {
    const existingUser = await FindOneVandor(user._id);
    if (existingUser != null) {
      existingUser.name = name;
      existingUser.foodType = foodType;
      existingUser.address = address;
      existingUser.phone = phone;

      const savedata = await existingUser.save();
      return res.json(savedata);
    }
    return res.json(existingUser);
  }
  return res.json({ message: "Vandor not found" });
};

export const UpdateVandorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    let vandor = await FindOneVandor(user._id);
    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const fileName = files.map((f: Express.Multer.File) => f.filename);
      console.log(fileName);
      vandor.coverImage.push(...fileName);
      const savedata = await vandor.save();

      return res.json(savedata);
    }
  }
  return res.json({ message: "Something went wrong with update cover images" });
};

export const UpdateVandorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { lat, lng } = req.body;
  if (user) {
    const existingUser = await FindOneVandor(user._id);
    if (existingUser != null) {
      existingUser.serviceAvailable = !existingUser.serviceAvailable;
      if (lat && lng) {
        existingUser.lat = lat;
        existingUser.lng = lng;
      }
      const savedata = await existingUser.save();
      return res.json(savedata);
    }
    return res.json(existingUser);
  }
  return res.json({ message: "Vandor not found" });
};

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const { name, category, foodType, description, price, readyTime } = <
      CreateFoodInputs
    >req.body;
    const vandor = await FindOneVandor(user._id);
    if (vandor !== null) {
      const files = req.files as [Express.Multer.File];

      const fileName = files.map((f: Express.Multer.File) => f.filename);

      const createFood = await Food.create({
        vandorId: vandor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readyTime: readyTime,
        price: price,
        rating: 0,
        images: fileName,
      });

      vandor.foods.push(createFood);
      const savedata = await vandor.save();

      return res.json(savedata);
    }
  }
  return res.json({ message: "Something went wrong with add food" });
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const foodData = await Food.find({ vandorId: user._id });
    return res.json(foodData);
  }
  return res.json({ message: "Food Info Not Found" });
};

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const orderData = await Order.find({ vandorId: user._id }).populate(
      "items.food"
    );
    if (orderData != null) {
      return res.status(200).json(orderData);
    }
  }
  return res.status(400).json({ message: "Current Order Not Found" });
};

export const GetOrdersDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  if (orderId) {
    const orderData = await Order.findById(orderId).populate("items.food");
    if (orderData != null) {
      return res.status(200).json(orderData);
    }
  }
  return res.status(400).json({ message: "Current Order Not Found" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;
  const { status, remark, time } = req.body;
  if (orderId) {
    const selectOrder = await Order.findById(orderId).populate("items.food");

    if (selectOrder != null) {
      selectOrder.orderStatus = status;
      selectOrder.remarks = remark;
      if (time) {
        selectOrder.readyTime = time;
      }

      const savedata = await selectOrder.save();

      if (savedata) {
        return res.status(200).json(savedata);
      }
    }
  }

  return res.status(400).json({ message: "Error in process order" });
};

export const GetOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.user;

  if (user) {
    const alloffers = await Offer.find().populate("vendors");

    let currentoffers = Array();

    alloffers.map((item) => {
      if (item.vendors) {
        item.vendors.map((itemvender) => {
          if (itemvender._id === user._id) {
            currentoffers.push(item);
          }
        });
      }

      if (item.offerType == "GENERIC") {
        currentoffers.push(item);
      }
    });

    return res.status(200).json(currentoffers);
  }

  return res.status(400).json({ message: "Error in Get Offers" });
};

export const AddOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.user;

  if (user) {
    const vendorprofile = await FindOneVandor(user._id);

    const {
      offerType,
      title,
      description,
      minValue,
      offerAmount,
      startValidity,
      endValidity,
      promocode,
      promoType,
      bank,
      bins,
      pincode,
      isActive,
    } = <CreateOfferInput>req.body;

    const dataInserted = await Offer.create({
      offerType: offerType,
      vendors: vendorprofile,
      title: title,
      description: description,
      minValue: minValue,
      offerAmount: offerAmount,
      startValidity: startValidity,
      endValidity: endValidity,
      promocode: promocode,
      promoType: promoType,
      bank: bank,
      bins: bins,
      pincode: pincode,
      isActive: isActive,
    });

    if (dataInserted) {
      return res.status(200).json(dataInserted);
    }
  }

  return res.status(400).json({ message: "Error in Add Offers" });
};

export const EditOffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user = req.user;
  const offerid = req.params.id;

  if (user) {
    const offer = await Offer.findById(offerid);
    if (offer) {
      const vendorprofile = await FindOneVandor(user._id);
      if (vendorprofile) {
        const {
          offerType,
          title,
          description,
          minValue,
          offerAmount,
          startValidity,
          endValidity,
          promocode,
          promoType,
          bank,
          bins,
          pincode,
          isActive,
        } = <CreateOfferInput>req.body;

        offer.offerType = offerType;

        offer.title = title;
        offer.description = description;
        offer.minValue = minValue;
        offer.offerAmount = offerAmount;
        offer.startValidity = startValidity;
        offer.endValidity = endValidity;
        offer.promocode = promocode;
        offer.promoType = promoType;
        offer.bank = bank;
        offer.bins = bins;
        offer.pincode = pincode;
        offer.isActive = isActive;

        const offerupdate = await offer.save();

        return res.status(200).json(offerupdate);
      }
    }
  }

  return res.status(400).json({ message: "Error in Update Offers" });
};
