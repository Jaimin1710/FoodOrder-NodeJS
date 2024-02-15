import mongoose, { Schema, Document } from "mongoose";

export interface DeliveryUserDoc extends Document {
  email: string;
  password: string;
  phone: string;
  salt: string;
  firstName: string;
  lastName: string;
  address: string;
  pincode: string;
  verified: boolean;
  lat: number;
  lng: number;
  isAvailable: boolean;
}

const DeliveryUserSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pincode: { type: String },
    verified: { type: Boolean, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v,
          delete ret.createdAt,
          delete ret.updatedAt,
          delete ret.password,
          delete ret.salt;
      },
    },
    timestamps: true,
  }
);

const DeliveryUser = mongoose.model<DeliveryUserDoc>(
  "deliveryuser",
  DeliveryUserSchema
);

export { DeliveryUser };
