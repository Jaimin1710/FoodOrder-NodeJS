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
exports.VerifyDeliveryUser = exports.GetDeliveryUsers = exports.GetTransactionByIDAdmin = exports.GetTransaction = exports.GetVandorById = exports.GetVandors = exports.CreateVandor = exports.FindOneVandor = void 0;
const models_1 = require("../models");
const utility_1 = require("../utility");
const Transaction_1 = require("../models/Transaction");
const FindOneVandor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vandor.findOne({ email: email });
    }
    else {
        return yield models_1.Vandor.findById(id);
    }
});
exports.FindOneVandor = FindOneVandor;
const CreateVandor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, pincode, ownerName, phone, foodType, email, password, } = req.body;
    const checkEmail = yield (0, exports.FindOneVandor)("", email);
    if (checkEmail != null) {
        return res.json({ message: "User Exist" });
    }
    // generate salt
    const salt = yield (0, utility_1.Generatesalt)();
    // encrpt password using salt
    const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
    const createVandor = yield models_1.Vandor.create({
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
});
exports.CreateVandor = CreateVandor;
const GetVandors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield models_1.Vandor.find();
    if (data != null) {
        return res.json(data);
    }
    return res.json({ message: "Data not found" });
});
exports.GetVandors = GetVandors;
const GetVandorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    //console.log('id'+id);
    /* const data = await FindOneVandor(id);
      if(data!=null)
      {
          return res.json(data);
      }
      
      return res.json({'message':'Data not found'});*/
    models_1.Vandor.findById(id)
        .then((result) => {
        return res.json(result);
    })
        .catch((err) => {
        return res.json({ err: err });
    });
});
exports.GetVandorById = GetVandorById;
const GetTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const alltransaction = yield Transaction_1.Transaction.find();
    if (alltransaction) {
        return res.status(200).json(alltransaction);
    }
    return res.status(400).json({ message: "No Transaction History" });
});
exports.GetTransaction = GetTransaction;
const GetTransactionByIDAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let id = req.params.id;
    const alltransaction = yield Transaction_1.Transaction.findById(id);
    if (alltransaction) {
        return res.status(200).json(alltransaction);
    }
    return res.status(400).json({ message: "No Transaction History" });
});
exports.GetTransactionByIDAdmin = GetTransactionByIDAdmin;
const GetDeliveryUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const alluser = yield models_1.DeliveryUser.find();
    if (alluser) {
        return res.status(200).json(alluser);
    }
    return res.status(400).json({ message: "No User History" });
});
exports.GetDeliveryUsers = GetDeliveryUsers;
const VerifyDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, status } = req.body;
    const alluser = yield models_1.DeliveryUser.findById(_id);
    if (alluser) {
        alluser.verified = status;
        yield alluser.save();
        return res.status(200).json(alluser);
    }
    return res
        .status(400)
        .json({ message: "error in update delivery user verification" });
});
exports.VerifyDeliveryUser = VerifyDeliveryUser;
//# sourceMappingURL=AdminController.js.map