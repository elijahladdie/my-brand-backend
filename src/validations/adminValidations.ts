import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const createAdmin = Joi.object({
    email: Joi.string().required(),
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    recoveryPassword: Joi.string().required(),
}).options({ abortEarly: false });

export const createAdminValidationError = (req: Request, res: Response, next: NextFunction) => {
    const { error } = createAdmin.validate(req.body);

    if (error) {
        // Handle validation error
        return res.status(400).json({ error: error.details.map((err: any) => err.message) });
    }
console.log("Error")
    next();
};
