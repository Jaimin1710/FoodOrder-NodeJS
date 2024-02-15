export interface CreateVandorInput{
    name:string;
    ownerName: string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;

}

export interface EditVandorInputs{
    name:string;
    address:string;
    foodType:[string];
    phone:string;
}
export interface VandorLoginInputs{
    email:string;
    password:string;
}

export interface VandorPayload{
    _id:string;
    name:string;
    foodType:[string];
    email:string;
}

export interface CreateOfferInput{
    offerType: string; // vendor generic
    vendors:[any];
    title:string;
    description: string;
    minValue: number;
    offerAmount: number;
    startValidity:Date;
    endValidity:Date;
    promocode:string;
    promoType: string; // user bank all card
    bank:[any];
    bins:[any];
    pincode:string;
    isActive: boolean;
}