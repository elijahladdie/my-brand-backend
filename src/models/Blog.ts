import mongoose, { Schema, Document } from 'mongoose';

interface BlogDoc extends Document {
    blogTitle: string;
    blogImage: string;
    blogBody: string;
    comments:[string];
    likes:number;
}

const BlogSchema: Schema = new Schema({
    blogTitle: { type: String, required: true },
    blogImage: { type: String, required: true },
    blogBody: { type: String, required: true },
    comments: [{ type: String }],
    likes: { type: Number },
}, { timestamps: true });;

export const Blog = mongoose.model<BlogDoc>('Blog', BlogSchema);
