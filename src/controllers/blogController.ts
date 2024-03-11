import { Request, Response, NextFunction } from 'express';
import { Blog } from '../models/Blog';
import { CreateBlogPayload } from '../dto/Auth.dto';
import uploadFile from '../utility/cloudinary';

export const CreateBlog = async (req: Request, res: Response, next: NextFunction) => {
    const { blogTitle, blogBody, comments, likes } = req.body as CreateBlogPayload;
    const existingBlog = await Blog.findOne({ blogTitle });
    if (existingBlog) {
        return res.json({ "Message": "Blog already exists" });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const blogImage: any = await uploadFile(req.file, res)

    const CreatedBlog = await Blog.create({
        blogTitle, blogBody, comments, likes, blogImage: blogImage.secure_url
    });
    return res.json(CreatedBlog);
}


export const GetBlog = async (req: Request, res: Response, next: NextFunction) => {

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















// import { Request, Response, NextFunction } from 'express';

// export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // Extract blog data from request body
//         const { blogTitle, blogImage, blogBody, comments, likes } = req.body;

//         // Create a new blog document
//         const newBlog = new BlogModel({
//             blogTitle,
//             blogImage,
//             blogBody,
//             comments: comments || [], // Initialize to empty array if not provided
//             likes: likes || [], // Initialize to empty array if not provided
//         });

//         // Save the blog document to the database
//         await newBlog.save();

//         // Respond with the newly created blog
//         return res.status(201).json(newBlog);
//     } catch (error) {
//         // Handle errors
//         console.error("Error creating blog:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
