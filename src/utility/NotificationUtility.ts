//otp
export const GenerateOTP = ()=>{
    const otp = Math.floor(100000+ Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime()+ (30*60*1000));

    return {otp,expiry};

}

export const onRequestOTP = async (otp:number, toPhone:string)=>{
    const SID = 'ACf9551f64dca6d03b8cdc1dcab884e02e';
    const token = '1f735f2b4c6e3ae21899a14475b4c0e4';
    
    //const account = require('twilio')(SID,token);

    /*const resp = await account.messages.create({
        body:`Your Food Order OTP: ${otp}`,
        from:'+17752547626',
        to:`+91${toPhone}`

    });

    return resp;*/
}

//email
//paymet notification or email
//notification