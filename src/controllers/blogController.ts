import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';
import { CreateBlogPayload } from '../dto/Auth.dto';
import uploadFile from '../utility/cloudinary';

export const CreateBlog = async (req: Request, res: Response, next: NextFunction) => {
    const { blogTitle, blogBody, comments, } = req.body as CreateBlogPayload;
    const existingBlog = await Blog.findOne({ blogTitle });
    if (existingBlog) {
        return res.json({ "Message": "Blog already exists" });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const blogImage: any = await uploadFile(req.file, res)

    const CreatedBlog = await Blog.create({
        blogTitle, blogBody, comments, likes: 0, blogImage: blogImage.secure_url
    });
    return res.json({ message: "Blog Created successfully", CreatedBlog });
}

export const GetBlog = async (req: Request, res: Response, next: NextFunction) => {
    const { blog_id } = req.params
    if (blog_id) {
        try {
            const blog = await Blog.findOne({ _id: blog_id });

            if (!blog) {

                return res.status(200).json({ message: "No Blog Found", blog });
            }
            return res.status(200).json({ message: "Blog fetched successfully", blog });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    try {
        const blog = await Blog.find();

        if (!blog) {

            return res.status(200).json({ message: "No Blog Found", blog });
        }
        return res.status(200).json({ message: "Blog fetched successfully", blog });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    const { blog_id } = req.params;
    const { blogTitle, blogBody, comments } = req.body as CreateBlogPayload;
    const existingBlog: any = await Blog.findById(blog_id);
    if (!existingBlog) {
        return res.status(404).json({ "Message": "Blog not found" });
    }

    try {
        if (blogTitle) existingBlog.blogTitle = blogTitle;
        if (blogBody) existingBlog.blogBody = blogBody;
        if (comments) existingBlog.comments.push(comments);

        if (req.file) {
            const blogImage: any = await uploadFile(req.file, res);
            existingBlog.blogImage = blogImage.secure_url;
        }
        const updatedBlog = await Blog.findByIdAndUpdate({ _id: blog_id }, existingBlog, { new: true })
        return res.json({ message: "Blog updated successfully", updatedBlog });
    } catch (error) {
        return res.status(500).json({ "Message": "Internal server error" });
    }
}

export const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
    const { blog_id } = req.params;
    const existingBlog: any = await Blog.findById(blog_id);
    if (!existingBlog) {
        return res.status(404).json({ "Message": "Blog not found" });
    }

    try {
        existingBlog.likes += 1;

        const updatedBlog = await Blog.findByIdAndUpdate({ _id: blog_id }, existingBlog, { new: true })
        return res.json({ message: "Blog Liked successfully", updatedBlog });
    } catch (error) {
        return res.status(500).json({ "Message": "Internal server error" });
    }
}


export const deleteBlog = async (req: Request, res: Response,) => {
    const { blog_id } = req.params;
    try {
        const blog = await Blog.findOneAndDelete({ _id: blog_id });
        if (!blog) {
            return res.status(401).json({ message: "Blog not Found" });
        }
        res.status(201).json({
            message: "Blog successful removed!",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};