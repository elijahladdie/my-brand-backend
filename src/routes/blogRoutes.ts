import express, { Request, Response, NextFunction } from 'express';
import { CreateBlog, GetBlog } from '../controllers/blogController';
import upload from '../utility/multer';

const router = express.Router();

router.post('/create', upload.single("blogImage"), CreateBlog);

router.put('/update/:blog_id',GetBlog);

router.delete('/delete/:blog_id', GetBlog);

router.get('/all', GetBlog);

router.get('/byid/:blog_id',GetBlog );

export { router as blogRoutes };
