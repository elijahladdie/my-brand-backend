import express from 'express';
import { CreateBlog, GetBlog, createComment, deleteAllBlogs, deleteBlog, likeBlog, updateBlog } from '../controllers/blogController';
import upload from '../utility/multer';
import isAuthenticated from '../utility/VerifyToken';
import { CreateBlogValidationError, CreateCommentValidationError } from '../validations/BlogValidation';

const router = express.Router();
router.use(isAuthenticated)
router.get('/all', GetBlog);
router.get('/byid/:blog_id', GetBlog);
router.post('/create', upload.single("blogImage"), CreateBlogValidationError, CreateBlog);
router.put('/like/:blog_id', likeBlog);
router.put('/update/:blog_id', upload.single("blogImage"), updateBlog);

router.post('/:blog_id/comment', CreateCommentValidationError, createComment);
router.delete('/delete/:blog_id', deleteBlog);
if (process.env.APP_ENV as string === 'testing') {
    router.delete('/danger', deleteAllBlogs);
}


export { router as blogRoutes };
