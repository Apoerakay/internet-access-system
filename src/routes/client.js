import Router from "express"
import { getActiveClients, validateClientAccess } from "../controllers/client.js";
import { clientLogout } from "../controllers/client.js";

const router=Router()

router.post('/client/access', validateClientAccess, (req,res) => {
    res.json({ message: 'Access granted' });
  });
router.get('/active-clients',getActiveClients)

  router.post('/client/logout', clientLogout);


  export default router;