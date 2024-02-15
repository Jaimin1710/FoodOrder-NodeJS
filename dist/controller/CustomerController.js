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
exports.CreatePayment = exports.Verifyoffer = exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.GetOrderByID = exports.GetOrders = exports.CreateOrders = exports.assignOrderToDelivery = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const Customer_dto_1 = require("../dto/Customer.dto");
const class_validator_1 = require("class-validator");
const utility_1 = require("../utility");
const Customer_1 = require("../models/Customer");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const Transaction_1 = require("../models/Transaction");
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inputdata = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInput, req.body);
    const inputvalidate = yield (0, class_validator_1.validate)(inputdata, {
        validationError: { target: true },
    });
    if (inputvalidate.length > 0) {
        return res.status(400).json(inputvalidate);
    }
    const { email, phone, password } = inputdata;
    const salt = yield (0, utility_1.Generatesalt)();
    const passwordGenerate = yield (0, utility_1.GeneratePassword)(password, salt);
    const { otp, expiry } = (0, utility_1.GenerateOTP)();
    const existingCust = yield Customer_1.Customer.findOne({ email: email });
    if (existingCust != null) {
        return res.status(409).json({ message: "User already exist" });
    }
    const result = yield Customer_1.Customer.create({
        email: email,
        password: passwordGenerate,
        phone: phone,
        salt: salt,
        firstName: "",
        lastName: "",
        address: "",
        verified: false,
        otp: otp,
        otp_expiry: expiry,
        lat: 0,
        lng: 0,
        orders: [],
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
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const loginData = (0, class_transformer_1.plainToClass)(Customer_dto_1.LoginCustomerInput, req.body);
    let validation = yield (0, class_validator_1.validate)(loginData, {
        validationError: { target: true },
    });
    if (validation.length > 0) {
        return res.status(400).json(class_validator_1.validate);
    }
    const { email, password } = loginData;
    const oneuser = yield Customer_1.Customer.findOne({ email: email });
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
            return res.status(400).json({ message: "User Password Mismatched" });
        }
    }
    return res.status(400).json({ message: "User not found" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp } = req.body;
    const cust = req.user;
    //console.log(cust?.email);
    if (cust != null) {
        const customerProfile = yield Customer_1.Customer.findById(cust._id);
        if (customerProfile != null) {
            if (customerProfile.otp === parseInt(otp) &&
                customerProfile.otp_expiry >= new Date()) {
                customerProfile.verified = true;
                const data = yield customerProfile.save();
                let signatureGen = yield (0, utility_1.GenerateSignature)({
                    _id: data._id,
                    email: data.email,
                    verified: data.verified,
                });
                return res.status(200).json({
                    signature: signatureGen,
                    email: data.email,
                    verified: data.verified,
                });
            }
            else {
                return res.status(400).json({ message: "Invalid otp" });
            }
        }
    }
    return res.status(400).json({ message: "Error with verify otp" });
});
exports.CustomerVerify = CustomerVerify;
const RequestOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const profile = req.user;
    if (profile) {
        const cust = yield Customer_1.Customer.findById(profile._id);
        const { otp, expiry } = yield (0, utility_1.GenerateOTP)();
        if (cust) {
            cust.otp = otp;
            cust.otp_expiry = expiry;
            yield cust.save();
            yield (0, utility_1.onRequestOTP)(otp, cust.phone);
            return res.status(200).json({ message: "Otp send successfully" });
        }
    }
    return res.status(400).json({ message: "Error with resend otp" });
});
exports.RequestOTP = RequestOTP;
const GetCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const profile = yield Customer_1.Customer.findById(user._id);
        if (profile) {
            return res.status(200).json(profile);
        }
    }
    return res.status(400).json({ message: "Error with fetch profile" });
});
exports.GetCustomerProfile = GetCustomerProfile;
const EditCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const editdata = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
    let validationprofile = yield (0, class_validator_1.validate)(editdata, {
        validationError: { target: true },
    });
    let { firstName, lastName, address } = editdata;
    if (validationprofile) {
        const user = req.user;
        if (user) {
            const profile = yield Customer_1.Customer.findById(user._id);
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
exports.EditCustomerProfile = EditCustomerProfile;
const ValidateTransaction = (tnxid) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield Transaction_1.Transaction.findById(tnxid);
    if (transaction) {
        if (transaction.status.toLocaleLowerCase() !== "failed") {
            return { status: true, transaction };
        }
    }
    return { status: false, transaction };
});
const assignOrderToDelivery = (oerderId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield models_1.Vandor.findById(vendorId);
    if (vendor) {
        const pincode = vendor.pincode;
        const latitude = vendor.lat;
        const longitude = vendor.lng;
        /* const deliveryBoy = await DeliveryUser.find({
          isAvailable: true,
          pincode: pincode,
          verified: true,
        });
    
        if (deliveryBoy) {
          const order = await Order.findById(oerderId);
    
          if (order) {
            order.deliveryId = deliveryBoy[0]._id;
    
            await order.save();
          }
        }*/
    }
});
exports.assignOrderToDelivery = assignOrderToDelivery;
const CreateOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get login user
    const customer = req.user;
    const { tnxId, amount, items } = req.body;
    if (customer) {
        const { status, transaction } = yield ValidateTransaction(tnxId);
        if (!status) {
            return res.status(400).json({ message: "error to create order" });
        }
        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
        const profile = yield Customer_1.Customer.findById(customer._id);
        let vendorId;
        if (profile) {
            let cartItems = Array();
            let netAmount = 0.0;
            const foods = yield models_1.Food.find()
                .where("_id")
                .in(items.map((item) => item._id))
                .exec();
            foods.map((food) => {
                items.map(({ _id, unit }) => {
                    if (food._id == _id) {
                        vendorId = food.vandorId;
                        netAmount += unit * food.price;
                        cartItems.push({ food, unit });
                    }
                });
            });
            if (cartItems) {
                const currentOrder = yield Order_1.Order.create({
                    orderID: orderId,
                    items: cartItems,
                    totalAmount: netAmount,
                    paidAmount: amount,
                    orderDate: new Date(),
                    orderStatus: "waiting",
                    vandorId: vendorId,
                    remarks: "",
                    deliveryId: "",
                    readyTime: 45,
                });
                if (currentOrder) {
                    profile.cart = [];
                    profile.orders.push(currentOrder);
                    transaction.vendorId = vendorId;
                    transaction.orderId = orderId;
                    transaction.status = "CONFIRMED";
                    yield transaction.save();
                    (0, exports.assignOrderToDelivery)(currentOrder._id, vendorId);
                    const pfres = yield profile.save();
                    if (pfres) {
                        return res.status(200).json(pfres);
                    }
                }
            }
        }
    }
    return res.status(400).json({ message: "Error with create order" });
});
exports.CreateOrders = CreateOrders;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id).populate("orders");
        return res.status(200).json(profile);
    }
    return res.status(400).json({ message: "Error with get order" });
});
exports.GetOrders = GetOrders;
const GetOrderByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderid = req.params.id;
    if (orderid) {
        const orderdata = yield Order_1.Order.find({ orderID: orderid }).populate("items.food");
        return res.status(200).json(orderdata);
    }
    return res.status(400).json({ message: "Error with get order" });
});
exports.GetOrderByID = GetOrderByID;
const AddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id).populate("cart.food");
        let cartItems = Array();
        const { _id, unit } = req.body;
        const food = yield models_1.Food.findById(_id);
        if (food) {
            if (profile != null) {
                cartItems = profile.cart;
                if (cartItems.length > 0) {
                    //check and update
                    let checkitem = cartItems.filter((item) => item.food._id.toString() === _id);
                    if (checkitem.length > 0) {
                        const index = cartItems.indexOf(checkitem[0]);
                        if (unit > 0) {
                            cartItems[index] = { food, unit };
                        }
                        else {
                            cartItems.splice(index, 1);
                        }
                    }
                    else {
                        cartItems.push({ food, unit });
                    }
                }
                else {
                    cartItems.push({ food, unit });
                }
                profile.cart = cartItems;
                const result = yield profile.save();
                return res.status(200).json(result.cart);
            }
        }
    }
    return res.status(400).json({ message: "Error with Add to cart" });
});
exports.AddToCart = AddToCart;
const GetCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id).populate("cart.food");
        if (profile) {
            return res.status(200).json(profile.cart);
        }
    }
    return res.status(400).json({ message: "Cart is empty!" });
});
exports.GetCart = GetCart;
const DeleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user;
    if (customer) {
        const profile = yield Customer_1.Customer.findById(customer._id).populate("cart.food");
        if (profile) {
            profile.cart = [];
            const cartresult = yield profile.save();
            return res.status(200).json(cartresult);
        }
    }
    return res.status(400).json({ message: "Cart is aready empty!" });
});
exports.DeleteCart = DeleteCart;
const Verifyoffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const offerid = req.params.id;
    const customer = req.user;
    if (customer) {
        const offer = yield models_1.Offer.findById(offerid);
        if (offer) {
            if (offer.isActive) {
                if (offer.promoType == "USER") {
                    // logic for once per user
                }
                else {
                    return res
                        .status(200)
                        .json({ message: "offer is valid", offer: offer });
                }
            }
        }
    }
    return res.status(400).json({ message: "Offer not valid!" });
});
exports.Verifyoffer = Verifyoffer;
const CreatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, paymentMode, offerId } = req.body;
    const customer = req.user;
    let payableAmount = Number(amount);
    if (customer) {
        const offer = yield models_1.Offer.findById(offerId);
        if (offer) {
            if (offer.isActive) {
                payableAmount -= offer.offerAmount;
            }
        }
        const transaction = yield Transaction_1.Transaction.create({
            customer: customer._id,
            vendorId: "",
            orderId: "",
            orderValue: payableAmount,
            offerUsed: offerId || "NA",
            status: "open",
            paymentMode: paymentMode,
            paymentResponse: "payment is COD",
        });
        if (transaction) {
            return res.status(200).json(transaction);
        }
    }
    return res.status(400).json({ message: "Offer not valid!" });
});
exports.CreatePayment = CreatePayment;
//# sourceMappingURL=CustomerController.js.map