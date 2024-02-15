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
exports.onRequestOTP = exports.GenerateOTP = void 0;
//otp
const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
const onRequestOTP = (otp, toPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const SID = 'ACf9551f64dca6d03b8cdc1dcab884e02e';
    const token = '1f735f2b4c6e3ae21899a14475b4c0e4';
    //const account = require('twilio')(SID,token);
    /*const resp = await account.messages.create({
        body:`Your Food Order OTP: ${otp}`,
        from:'+17752547626',
        to:`+91${toPhone}`

    });

    return resp;*/
});
exports.onRequestOTP = onRequestOTP;
//email
//paymet notification or email
//notification
//# sourceMappingURL=NotificationUtility.js.map