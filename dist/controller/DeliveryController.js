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
exports.UpdateDeliveryUserStatus = exports.EditDeliveryUserProfile = exports.GetDeliveryUserProfile = exports.DeliveryUserLogin = exports.DeliveryUserSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const models_1 = require("../models");
const DeliveryUserSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inputdata = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateDeliveryUserInput, req.body);
    const inputvalidate = yield (0, class_validator_1.validate)(inputdata, {
        validationError: { target: true },
    });
    if (inputvalidate.length > 0) {
        return res.status(400).json(inputvalidate);
    }
    const { email, phone, password, firstName, lastName, address, pincode } = inputdata;
    const salt = yield (0, utility_1.Generatesalt)();
    const passwordGenerate = yield (0, utility_1.GeneratePassword)(password, salt);
    const existingCust = yield models_1.DeliveryUser.findOne({ email: email });
    if (existingCust != null) {
        return res.status(409).json({ message: "Delivery User already exist" });
    }
    const result = yield models_1.DeliveryUser.create({
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
        const signatureGen = yield (0, utility_1.GenerateSignature)({
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
});
exports.DeliveryUserSignUp = DeliveryUserSignUp;
const DeliveryUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = (0, class_transformer_1.plainToClass)(Customer_dto_1.LoginCustomerInput, req.body);
    let validation = yield (0, class_validator_1.validate)(loginData, {
        validationError: { target: true },
    });
    if (validation.length > 0) {
        return res.status(400).json(class_validator_1.validate);
    }
    const { email, password } = loginData;
    const oneuser = yield models_1.DeliveryUser.findOne({ email: email });
    if (oneuser != null) {
        const validatepassword = yield (0, utility_1.ValidatePassword)(password, oneuser.password, oneuser.salt);
        if (validatepassword) {
            const signatureGen = yield (0, utility_1.GenerateSignature)({
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
        }
        else {
            return res
                .status(400)
                .json({ message: "Delivery User Password Mismatched" });
        }
    }
    return res.status(400).json({ message: "Delivery User not found" });
});
exports.DeliveryUserLogin = DeliveryUserLogin;
const GetDeliveryUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield models_1.DeliveryUser.findById(user._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: "Error with fetch profile" });
});
exports.GetDeliveryUserProfile = GetDeliveryUserProfile;
const EditDeliveryUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const editdata = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    let validationprofile = yield (0, class_validator_1.validate)(editdata, {
        validationError: { target: true },
    });
    let { firstName, lastName, address } = editdata;
    if (validationprofile) {
        const user = req.user;
        if (user) {
            const profile = yield models_1.DeliveryUser.findById(user._id);
            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                yield profile.save();
                return res.status(200).json(profile);
            }
        }
    }
    return res.status(400).json({ message: "Error with fetch profile" });
});
exports.EditDeliveryUserProfile = EditDeliveryUserProfile;
const UpdateDeliveryUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { lat, lng } = req.body;
    if (user) {
        const deliveryuser = yield models_1.DeliveryUser.findById(user._id);
        if (deliveryuser) {
            deliveryuser.isAvailable = !deliveryuser.isAvailable;
            if (lat && lng) {
                deliveryuser.lat = lat;
                deliveryuser.lng = lng;
            }
            yield deliveryuser.save();
            return res.status(200).json(deliveryuser);
        }
    }
});
exports.UpdateDeliveryUserStatus = UpdateDeliveryUserStatus;
//# sourceMappingURL=DeliveryController.js.map