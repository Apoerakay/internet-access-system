import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { Admin } from "../models/user.js"
import { Client } from "../models/user.js"

const generateOtp = () => Math.floor(1000 + Math.random() * 900000).toString(); //6 digit code

async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

export const Login= async(req,res)=>{
    const {username, password}=req.body
    const admin = await Admin.findOne({username})

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(403).json({ message: 'Invalid credentials' });
      }
    

    const isPasswordValid=await bcrypt.compare(password,admin.password);
    if(!isPasswordValid){
        return res.status(401).json({message:"invalid credentials"});
    }

    const token = jwt.sign({ id: admin._id }, 'admin_secret_key', { expiresIn: '1h' });
    res.json({ token });

    

};



export const Signup=async(req,res)=>{
    
    const {username, password}=req.body
    const hashedPassword=await hashPassword(password)
    const userExists=await Admin.findOne({username})
    if(userExists){
        return res.status(400).json({ message: 'User already exists'})
    }

    const otp = generateOtp()
    const newAdmin=await Admin.create({
        username,
        password:hashedPassword,
        otp,
        otpExpires: Date.now()+15*60*1000
    })
    if(newAdmin){
        return res.status(201).json({
            message:"admin added successfully",
            username,
            otp
        });
    }else(
        res.status(400).json({message:"invalid data"})
    )
};
export const generateToken = async (req, res) => {
    const {  accessDuration } = req.body;
  
    const username = crypto.randomBytes(6).toString('hex').slice(0, 6);
    const password = crypto.randomBytes(8).toString('hex').slice(0, 8); // 8 characters long password

    const client = new Client({
      username,
      password,
      accessDuration,
    
    });
  
    await client.save();
    res.json({ 
        message: 'Token generated successfully',
         username, password,accessDuration });
  };
