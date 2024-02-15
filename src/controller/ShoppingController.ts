import { Request, Response, NextFunction } from "express";
import { FoodDoc, Offer, Vandor } from "../models";

export const GetFoodAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const data = await Vandor.find({ pincode: pincode, serviceAvailable: true })
    .sort([["rating", "descending"]])
    .populate("foods");
  if (data.length > 0) {
    return res.status(200).json(data);
  }
  return res
    .status(404)
    .json({ message: "Service unavailable in your location" });
};

export const GetTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const data = await Vandor.find({ pincode: pincode, serviceAvailable: true })
    .sort([["rating", "descending"]])
    .limit(10);
  if (data.length > 0) {
    return res.status(200).json(data);
  }
  return res
    .status(404)
    .json({ message: "Service unavailable in your location" });
};

export const GetFoodsIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const data = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (data.length > 0) {
    let foodary: any = [];
    data.map((result) => {
      const foods = result.foods as [FoodDoc];

      foodary.push(...foods.filter((f) => f.readyTime <= 5));
    });
    return res.status(200).json(foodary);
  }
  return res
    .status(404)
    .json({ message: "Service unavailable in your location" });
};

export const SearchFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const data = await Vandor.find({
    pincode: pincode,
    serviceAvailable: true,
  }).populate("foods");

  if (data.length > 0) {
    let foodonly: any = [];
    data.map((result) => foodonly.push(...result.foods));
    return res.status(200).json(foodonly);
  }
  return res
    .status(404)
    .json({ message: "Service unavailable in your location" });
};

export const GetRestaurantByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  const data = await Vandor.findById(id).populate("foods");

  if (data != null) {
    return res.status(200).json(data);
  }
  return res
    .status(404)
    .json({ message: "Service unavailable in your location" });
};

export const GetAvailableOffers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pincode = req.params.pincode;

  const data = await Offer.find({ pincode: pincode, isActive: true });

  if (data != null) {
    return res.status(200).json(data);
  }
  return res.status(404).json({ message: "No Offer Found" });
};
