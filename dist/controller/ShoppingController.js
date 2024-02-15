"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableOffers = exports.GetRestaurantByID = exports.SearchFoods = exports.GetFoodsIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const data = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (data.length > 0) {
        return res.status(200).json(data);
    }
    return res
        .status(404)
        .json({ message: "Service unavailable in your location" });
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const data = yield models_1.Vandor.find({ pincode: pincode, serviceAvailable: true })
        .sort([["rating", "descending"]])
        .limit(10);
    if (data.length > 0) {
        return res.status(200).json(data);
    }
    return res
        .status(404)
        .json({ message: "Service unavailable in your location" });
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodsIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const data = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    }).populate("foods");
    if (data.length > 0) {
        let foodary = [];
        data.map((result) => {
            const foods = result.foods;
            foodary.push(...foods.filter((f) => f.readyTime <= 5));
        });
        return res.status(200).json(foodary);
    }
    return res
        .status(404)
        .json({ message: "Service unavailable in your location" });
});
exports.GetFoodsIn30Min = GetFoodsIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const data = yield models_1.Vandor.find({
        pincode: pincode,
        serviceAvailable: true,
    }).populate("foods");
    if (data.length > 0) {
        let foodonly = [];
        data.map((result) => foodonly.push(...result.foods));
        return res.status(200).json(foodonly);
    }
    return res
        .status(404)
        .json({ message: "Service unavailable in your location" });
});
exports.SearchFoods = SearchFoods;
const GetRestaurantByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = yield models_1.Vandor.findById(id).populate("foods");
    if (data != null) {
        return res.status(200).json(data);
    }
    return res
        .status(404)
        .json({ message: "Service unavailable in your location" });
});
exports.GetRestaurantByID = GetRestaurantByID;
const GetAvailableOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const data = yield models_1.Offer.find({ pincode: pincode, isActive: true });
    if (data != null) {
        return res.status(200).json(data);
    }
    return res.status(404).json({ message: "No Offer Found" });
});
exports.GetAvailableOffers = GetAvailableOffers;
//# sourceMappingURL=ShoppingController.js.map