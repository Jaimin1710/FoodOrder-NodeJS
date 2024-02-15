import { IsEmail, Length } from "class-validator";
export class CreateCustomerInput {
  @IsEmail()
  email: string;

  @Length(7, 12)
  phone: string;

  @Length(6, 12)
  password: string;
}

export class LoginCustomerInput {
  @IsEmail()
  email: string;

  @Length(6, 12)
  password: string;
}

export class EditCustomerProfileInput {
  @Length(2, 20)
  firstName: string;
  @Length(2, 20)
  lastName: string;
  @Length(5, 100)
  address: string;
}

export interface CustomerPayload {
  _id: string;
  email: string;
  verified: boolean;
}

export class CartItem {
  _id: string;
  unit: number;
}

export class OrderInput {
  tnxId: string;
  amount: number;
  items: [CartItem];
}

export class CreateDeliveryUserInput {
  @IsEmail()
  email: string;

  @Length(1, 12)
  phone: string;

  @Length(1, 12)
  password: string;

  @Length(1, 12)
  firstName: string;

  @Length(1, 12)
  lastName: string;

  @Length(1, 24)
  address: string;

  @Length(1, 24)
  pincode: string;
}
