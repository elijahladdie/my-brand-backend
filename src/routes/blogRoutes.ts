import express, { Request, Response, NextFunction } from 'express';
import { CreateBlog, GetBlog, createComment, deleteBlog, likeBlog, updateBlog } from '../controllers/blogController';
import upload from '../utility/multer';
import isAuthenticated from '../utility/VerifyToken';
import { CreateBlogValidationError } from '../validations/BlogValidation';

const router = express.Router();
router.use(isAuthenticated)
router.post('/create', upload.single("blogImage"),CreateBlogValidationError ,CreateBlog);

router.put('/update/:blog_id',upload.single("blogImage"),updateBlog);
router.put('/like/:blog_id',likeBlog);
router.post('/:blog_id/comment',createComment);
router.delete('/delete/:blog_id', deleteBlog);

router.get('/all', GetBlog);

router.get('/byid/:blog_id',GetBlog );

export { router as blogRoutes };
