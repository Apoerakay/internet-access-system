import { Client } from "../models/user.js";

const getClientIp = (req) => {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

export const validateClientAccess = async (req, res, next) => {
    const { username, password } = req.body;
    const clientIp = getClientIp(req);

    const client = await Client.findOne({ username });

    // Check if client exists and password is correct
    if (!client || client.password !== password) {
        return res.status(403).json({ message: 'Invalid credentials' });
    }

    // Set token expiration if not set
    if (!client.tokenExpiresAt) {
        const tokenExpiresAt = new Date(Date.now() + client.accessDuration * 60000); // Set token expiration based on accessDuration
        client.tokenExpiresAt = tokenExpiresAt;
    }

    // Check if token is expired
    if (new Date() > client.tokenExpiresAt) {
        return res.status(403).json({ message: 'Access time expired' });
    }

    // Check if the client is already logged in from another device
    if (client.isActive && client.activeDeviceIp !== clientIp) {
        return res.status(403).json({ message: 'Already logged in from another device' });
    }

    // If not already logged in from another device, activate session and assign the device IP
    client.isActive = true;
    client.activeDeviceIp = clientIp;
    await client.save();

    // Call next to proceed to the next middleware or route
    next();
};

  // Controller to fetch active clients
export const getActiveClients = async (req, res) => {
    try {
      const activeClients = await Client.find({
        isActive: true, // Active status
        tokenExpiresAt: { $gt: new Date() }, // Token hasn't expired
      }).select('username activeDeviceIp tokenExpiresAt accessDuration'); // Selecting necessary fields
  
      // Respond with the list of active clients
      res.status(200).json({ message: 'Active clients fetched successfully', clients: activeClients });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching active clients', error: error.message });
    }
  };
  


  export const clientLogout= async(req,res)=>{
const {username}=req.body
const client = await Client.findOne({username});

    if(!client){
        return res.status(404).json({ message: 'Client not found' });
    }
    client.isActive = false;
    client.activeDeviceIp = null;
    await client.save();
  
    res.json({ message: 'Logged out successfully' });
  };