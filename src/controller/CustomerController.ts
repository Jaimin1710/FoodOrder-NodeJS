import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CartItem,
  CreateCustomerInput,
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
import { DeliveryUser, Food, Offer, Vandor } from "../models";
import { Order, OrderDoc } from "../models/Order";
import { Transaction } from "../models/Transaction";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inputdata = plainToClass(CreateCustomerInput, req.body);

  const inputvalidate = await validate(inputdata, {
    validationError: { target: true },
  });

  if (inputvalidate.length > 0) {
    return res.status(400).json(inputvalidate);
  }

  const { email, phone, password } = inputdata;

  const salt = await Generatesalt();
  const passwordGenerate = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOTP();

  const existingCust = await Customer.findOne({ email: email });
  if (existingCust != null) {
    return res.status(409).json({ message: "User already exist" });
  }

  const result = await Customer.create({
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
export const CustomerLogin = async (
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
  const oneuser = await Customer.findOne({ email: email });
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
      return res.status(400).json({ message: "User Password Mismatched" });
    }
  }
  return res.status(400).json({ message: "User not found" });
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { otp } = req.body;

  const cust = req.user;
  //console.log(cust?.email);
  if (cust != null) {
    const customerProfile = await Customer.findById(cust._id);

    if (customerProfile != null) {
      if (
        customerProfile.otp === parseInt(otp) &&
        customerProfile.otp_expiry >= new Date()
      ) {
        customerProfile.verified = true;

        const data = await customerProfile.save();

        let signatureGen = await GenerateSignature({
          _id: data._id,
          email: data.email,
          verified: data.verified,
        });

        return res.status(200).json({
          signature: signatureGen,
          email: data.email,
          verified: data.verified,
        });
      } else {
        return res.status(400).json({ message: "Invalid otp" });
      }
    }
  }

  return res.status(400).json({ message: "Error with verify otp" });
};

export const RequestOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const profile = req.user;

  if (profile) {
    const cust = await Customer.findById(profile._id);
    const { otp, expiry } = await GenerateOTP();
    if (cust) {
      cust.otp = otp;
      cust.otp_expiry = expiry;
      await cust.save();
      await onRequestOTP(otp, cust.phone);
      return res.status(200).json({ message: "Otp send successfully" });
    }
  }
  return res.status(400).json({ message: "Error with resend otp" });
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const profile = await Customer.findById(user._id);
    if (profile) {
      return res.status(200).json(profile);
    }
  }
  return res.status(400).json({ message: "Error with fetch profile" });
};

export const EditCustomerProfile = async (
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
      const profile = await Customer.findById(user._id);

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

const ValidateTransaction = async (tnxid: string) => {
  const transaction = await Transaction.findById(tnxid);

  if (transaction) {
    if (transaction.status.toLocaleLowerCase() !== "failed") {
      return { status: true, transaction };
    }
  }

  return { status: false, transaction };
};

export const assignOrderToDelivery = async (
  oerderId: string,
  vendorId: string
) => {
  const vendor = await Vandor.findById(vendorId);
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
};

export const CreateOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get login user
  const customer = req.user;

  const { tnxId, amount, items } = <OrderInput>req.body;

  if (customer) {
    const { status, transaction } = await ValidateTransaction(tnxId);
    if (!status) {
      return res.status(400).json({ message: "error to create order" });
    }

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
    const profile = await Customer.findById(customer._id);
    let vendorId;
    if (profile) {
      let cartItems = Array();
      let netAmount = 0.0;

      const foods = await Food.find()
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
        const currentOrder = await Order.create({
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
          profile.cart = [] as any;
          profile.orders.push(currentOrder);

          transaction.vendorId = vendorId;
          transaction.orderId = orderId;
          transaction.status = "CONFIRMED";

          await transaction.save();

          assignOrderToDelivery(currentOrder._id, vendorId);

          const pfres = await profile.save();

          if (pfres) {
            return res.status(200).json(pfres);
          }
        }
      }
    }
  }
  return res.status(400).json({ message: "Error with create order" });
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id).populate("orders");
    return res.status(200).json(profile);
  }

  return res.status(400).json({ message: "Error with get order" });
};

export const GetOrderByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderid = req.params.id;

  if (orderid) {
    const orderdata = await Order.find({ orderID: orderid }).populate(
      "items.food"
    );

    return res.status(200).json(orderdata);
  }

  return res.status(400).json({ message: "Error with get order" });
};

export const AddToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    let cartItems = Array();
    const { _id, unit } = <CartItem>req.body;

    const food = await Food.findById(_id);
    if (food) {
      if (profile != null) {
        cartItems = profile.cart;
        if (cartItems.length > 0) {
          //check and update
          let checkitem = cartItems.filter(
            (item) => item.food._id.toString() === _id
          );
          if (checkitem.length > 0) {
            const index = cartItems.indexOf(checkitem[0]);
            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }
          } else {
            cartItems.push({ food, unit });
          }
        } else {
          cartItems.push({ food, unit });
        }

        profile.cart = cartItems as any;
        const result = await profile.save();

        return res.status(200).json(result.cart);
      }
    }
  }

  return res.status(400).json({ message: "Error with Add to cart" });
};

export const GetCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      return res.status(200).json(profile.cart);
    }
  }

  return res.status(400).json({ message: "Cart is empty!" });
};

export const DeleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;
  if (customer) {
    const profile = await Customer.findById(customer._id).populate("cart.food");
    if (profile) {
      profile.cart = [] as any;
      const cartresult = await profile.save();

      return res.status(200).json(cartresult);
    }
  }

  return res.status(400).json({ message: "Cart is aready empty!" });
};

export const Verifyoffer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const offerid = req.params.id;
  const customer = req.user;
  if (customer) {
    const offer = await Offer.findById(offerid);

    if (offer) {
      if (offer.isActive) {
        if (offer.promoType == "USER") {
          // logic for once per user
        } else {
          return res
            .status(200)
            .json({ message: "offer is valid", offer: offer });
        }
      }
    }
  }

  return res.status(400).json({ message: "Offer not valid!" });
};
export const CreatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, paymentMode, offerId } = req.body;
  const customer = req.user;
  let payableAmount = Number(amount);
  if (customer) {
    const offer = await Offer.findById(offerId);

    if (offer) {
      if (offer.isActive) {
        payableAmount -= offer.offerAmount;
      }
    }
    const transaction = await Transaction.create({
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
};
