import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const CreateBlog = Joi.object({
    blogTitle: Joi.string().required(),
    blogBody: Joi.string().required(),
    blogImage: Joi.object().optional(),
}).options({ abortEarly: false });

export const CreateBlogValidationError = (req: Request, res: Response, next: NextFunction) => {
   if(req.file){
    req.body.blogImage = req.file
   }
    const { error } = CreateBlog.validate(req.body);
       if (error) {
        // Handle validation error
        return res.status(400).json({ error: error.details.map((err: any) => err.message) });
    }
    next();
};
