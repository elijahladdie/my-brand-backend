import express,{Request,Response,NextFunction} from 'express';
import { CreateAdmin,GetAdmin,Login } from '../controllers/adminController';
import { createAdminValidationError } from '../validations/adminValidations';
import isAuthenticated from '../utility/VerifyToken';
const router = express.Router();
router.post('/access/login',Login);
router.post('/create',createAdminValidationError,CreateAdmin);
router.use(isAuthenticated)
router.get('/',GetAdmin)
export {router as AdminRoutes  }