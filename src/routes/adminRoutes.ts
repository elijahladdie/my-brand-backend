import express,{Request,Response,NextFunction} from 'express';
import { RegisterAdmin,GetAdmin,Login } from '../controllers/adminController';
import { RegisterAdminValidationError } from '../validations/adminValidations';
import isAuthenticated from '../utility/VerifyToken';
const router = express.Router();
router.post('/access/login',Login);
router.post('/create',RegisterAdminValidationError,RegisterAdmin);
router.use(isAuthenticated)
router.get('/',GetAdmin)
export {router as AdminRoutes  }