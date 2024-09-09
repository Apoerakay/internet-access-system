import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp:String,
    otpExpires: Date
  });
  
 export const Admin = mongoose.model('Admin', adminSchema);
  
 
 
  
  const clientSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    accessDuration: { type: Number, required: true }, // in minutes
    tokenExpiresAt: { type: Date },
    isActive: { type: Boolean, default: false }, // Track active session
    activeDeviceIp: { type: String }, // To store the IP address of the logged-in device
  });
  
export const Client = mongoose.model('Client', clientSchema);