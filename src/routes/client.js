import Router from "express"
import { validateClientAccess } from "../controllers/client.js";
import { clientLogout } from "../controllers/client.js";

const router=Router()

router.post('/client/access', validateClientAccess, (req,res) => {
    res.json({ message: 'Access granted' });
  });

  router.post('/client/logout', clientLogout);


  export default router;