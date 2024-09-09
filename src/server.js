import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cors from "cors"
import adminRouter from "../src/routes/admin.js"
import clientRouter from "../src/routes/client.js"

dotenv.config()


const server = express()

server.use(express.json())
server.use(cors({
    origin: 'http://localhost:3000', // replace with your frontend domain
    methods: ['GET', 'POST'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
  }));
const mongoUri= process.env.mongoUrl

mongoose.connect(mongoUri,{}).then(()=>{
    console.log("database is connected")
}).catch((error)=>console.log(error))

const Port = process.env.Port || 8080

server.use(clientRouter)
server.use(adminRouter)


server.listen(Port,()=>{
    console.log(`server is running on ${Port}`)
})