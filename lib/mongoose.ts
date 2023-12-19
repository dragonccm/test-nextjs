import mongoose from "mongoose";

let isConnected = false; 

export const connectToDB = async () => {
  
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("Missing MongoDB URL");

  
  if (isConnected) {
    console.log("Kết nối MongoDB được rồi hú hú khẹt khẹt");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);

    isConnected = true; 
    console.log("Kết nối MongoDB được rồi hú hú khẹt khẹt");
  } catch (error) {
    console.log(error);
  }
};
