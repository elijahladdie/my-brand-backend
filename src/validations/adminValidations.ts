import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const RegisterAdmin = Joi.object({
    email: Joi.string().required(),
    fullName: Joi.string().required(),
    password: Joi.string().required(),
    recoveryPassword: Joi.string().required(),
}).options({ abortEarly: false });

export const RegisterAdminValidationError = (req: Request, res: Response, next: NextFunction) => {
    const { error } = RegisterAdmin.validate(req.body);

    if (error) {
        // Handle validation error
        return res.status(400).json({ error: error.details.map((err: any) => err.message) });
    }
    next();
};
