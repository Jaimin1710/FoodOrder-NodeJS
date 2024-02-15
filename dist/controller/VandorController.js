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
exports.EditOffer = exports.AddOffer = exports.GetOffers = exports.ProcessOrder = exports.GetOrdersDetails = exports.GetCurrentOrders = exports.GetFoods = exports.AddFood = exports.UpdateVandorService = exports.UpdateVandorCoverImage = exports.UpdateVandorProfile = exports.GetVandorProfile = exports.VandorLogin = void 0;
const AdminController_1 = require("./AdminController");
const utility_1 = require("../utility");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const VandorLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const checkEmail = yield (0, AdminController_1.FindOneVandor)("", email);
    if (checkEmail != null) {
        const validating = yield (0, utility_1.ValidatePassword)(password, checkEmail.password, checkEmail.salt);
        if (validating) {
            const signature = (0, utility_1.GenerateSignature)({
                email: checkEmail.email,
                _id: checkEmail._id,
                foodType: checkEmail.foodType,
                name: checkEmail.name,
            });
            return res.json(signature);
        }
        else {
            return res.json({ message: "Login password is invalid" });
        }
    }
    return res.json({ message: "User not found" });
});
exports.VandorLogin = VandorLogin;
const GetVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindOneVandor)(user._id);
        return res.json(existingUser);
    }
    return res.json({ message: "Vandor not found" });
});
exports.GetVandorProfile = GetVandorProfile;
const UpdateVandorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, phone, foodType } = req.body;
    const user = req.user;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindOneVandor)(user._id);
        if (existingUser != null) {
            existingUser.name = name;
            existingUser.foodType = foodType;
            existingUser.address = address;
            existingUser.phone = phone;
            const savedata = yield existingUser.save();
            return res.json(savedata);
        }
        return res.json(existingUser);
    }
    return res.json({ message: "Vandor not found" });
});
exports.UpdateVandorProfile = UpdateVandorProfile;
const UpdateVandorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        let vandor = yield (0, AdminController_1.FindOneVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const fileName = files.map((f) => f.filename);
            console.log(fileName);
            vandor.coverImage.push(...fileName);
            const savedata = yield vandor.save();
            return res.json(savedata);
        }
    }
    return res.json({ message: "Something went wrong with update cover images" });
});
exports.UpdateVandorCoverImage = UpdateVandorCoverImage;
const UpdateVandorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { lat, lng } = req.body;
    if (user) {
        const existingUser = yield (0, AdminController_1.FindOneVandor)(user._id);
        if (existingUser != null) {
            existingUser.serviceAvailable = !existingUser.serviceAvailable;
            if (lat && lng) {
                existingUser.lat = lat;
                existingUser.lng = lng;
            }
            const savedata = yield existingUser.save();
            return res.json(savedata);
        }
        return res.json(existingUser);
    }
    return res.json({ message: "Vandor not found" });
});
exports.UpdateVandorService = UpdateVandorService;
const AddFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const { name, category, foodType, description, price, readyTime } = req.body;
        const vandor = yield (0, AdminController_1.FindOneVandor)(user._id);
        if (vandor !== null) {
            const files = req.files;
            const fileName = files.map((f) => f.filename);
            const createFood = yield models_1.Food.create({
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
            const savedata = yield vandor.save();
            return res.json(savedata);
        }
    }
    return res.json({ message: "Something went wrong with add food" });
});
exports.AddFood = AddFood;
const GetFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const foodData = yield models_1.Food.find({ vandorId: user._id });
        return res.json(foodData);
    }
    return res.json({ message: "Food Info Not Found" });
});
exports.GetFoods = GetFoods;
const GetCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const orderData = yield Order_1.Order.find({ vandorId: user._id }).populate("items.food");
        if (orderData != null) {
            return res.status(200).json(orderData);
        }
    }
    return res.status(400).json({ message: "Current Order Not Found" });
});
exports.GetCurrentOrders = GetCurrentOrders;
const GetOrdersDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const orderData = yield Order_1.Order.findById(orderId).populate("items.food");
        if (orderData != null) {
            return res.status(200).json(orderData);
        }
    }
    return res.status(400).json({ message: "Current Order Not Found" });
});
exports.GetOrdersDetails = GetOrdersDetails;
const ProcessOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status, remark, time } = req.body;
    if (orderId) {
        const selectOrder = yield Order_1.Order.findById(orderId).populate("items.food");
        if (selectOrder != null) {
            selectOrder.orderStatus = status;
            selectOrder.remarks = remark;
            if (time) {
                selectOrder.readyTime = time;
            }
            const savedata = yield selectOrder.save();
            if (savedata) {
                return res.status(200).json(savedata);
            }
        }
    }
    return res.status(400).json({ message: "Error in process order" });
});
exports.ProcessOrder = ProcessOrder;
const GetOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    if (user) {
        const alloffers = yield models_1.Offer.find().populate("vendors");
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
});
exports.GetOffers = GetOffers;
const AddOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    if (user) {
        const vendorprofile = yield (0, AdminController_1.FindOneVandor)(user._id);
        const { offerType, title, description, minValue, offerAmount, startValidity, endValidity, promocode, promoType, bank, bins, pincode, isActive, } = req.body;
        const dataInserted = yield models_1.Offer.create({
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
});
exports.AddOffer = AddOffer;
const EditOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = req.user;
    const offerid = req.params.id;
    if (user) {
        const offer = yield models_1.Offer.findById(offerid);
        if (offer) {
            const vendorprofile = yield (0, AdminController_1.FindOneVandor)(user._id);
            if (vendorprofile) {
                const { offerType, title, description, minValue, offerAmount, startValidity, endValidity, promocode, promoType, bank, bins, pincode, isActive, } = req.body;
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
                const offerupdate = yield offer.save();
                return res.status(200).json(offerupdate);
            }
        }
    }
    return res.status(400).json({ message: "Error in Update Offers" });
});
exports.EditOffer = EditOffer;
//# sourceMappingURL=VandorController.js.map