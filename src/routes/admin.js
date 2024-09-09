import Router from "express"
import { Signup } from "../controllers/admin.js"
import { Login } from "../controllers/admin.js"
import { generateToken } from "../controllers/admin.js"



const router = Router()

router.post('/admin/signup',Signup);
router.post('/admin/login',Login);
router.post('/admin/generate-token', generateToken);

export default router;