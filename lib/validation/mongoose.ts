import mongoose from "mongoose";

let isConnected = false; 

export const connectToDB =async () => {
 mongoose.set("strictQuery", true);

 if(!process.env.MONGODB_URL)return console.log("Mongo not found");
 if(isConnected)return console.log("already is connected!!!");   

 try {
    await mongoose.connect(process.env.MONGODB_URL)

    isConnected = true;
    
    console.log("Mongo is connected!!!"); 
 } catch (error) {
    console.log(error);
 }
}