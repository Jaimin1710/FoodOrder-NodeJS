import mongoose,{Schema,Document} from "mongoose";
import { OrderDoc } from "./Order";

export interface CustomerDoc extends Document{
    email:string;
    password:string;
    phone: string;
    salt:string;
    firstName:string;
    lastName:string;
    address:string;
    verified:boolean;
    otp:number;
    otp_expiry:Date;
    lat:number;
    lng:number;
    cart:[any];
    orders:[OrderDoc];
}

const CustomerSchema = new Schema({
    
    email:{type:String,required: true},
    password:{type:String,required: true},
    phone: {type:String,required: true},
    salt:{type:String,required: true},
    firstName:{type:String},
    lastName:{type:String},
    address:{type:String},
    verified:{type:Boolean,required: true},
    otp:{type:Number,required: true},
    otp_expiry:{type:Date,required: true},
    lat:{type:Number},
    lng:{type:Number},
    cart:[
        {
            food: {type:Schema.Types.ObjectId,ref:"food",required:true},
            unit:{type: Number, required:true}
        }
    ],
    orders:[{type:Schema.Types.ObjectId,ref:'order'}]
},{
    toJSON:{
        transform(doc,ret)
        {
            delete ret.__v,
            delete ret.createdAt,
            delete ret.updatedAt,
            delete ret.password,
            delete ret.salt

        }
    },
    timestamps:true
});

const Customer = mongoose.model<CustomerDoc>('customer',CustomerSchema);

export {Customer};