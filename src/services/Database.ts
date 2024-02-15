import mongoose from "mongoose";
import { MONGO_URI } from "../config";


export default async()=>{
try {
    await mongoose.connect(MONGO_URI);
    console.log('connected to db');
} catch (error) {
    console.log("Err in connecting DB"+error);   
}
    
}

