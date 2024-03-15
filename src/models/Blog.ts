// models/Blog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface BlogDoc extends Document {
    blogTitle: string;
    blogImage: string;
    blogBody: string;
    comments: mongoose.Types.ObjectId[]; // Array of comment IDs
    likes: number;
}

const BlogSchema: Schema = new Schema({
    blogTitle: { type: String, required: true },
    blogImage: { type: String, required: true },
    blogBody: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }], // Reference to Comment model
    likes: { type: Number },
}, { timestamps: true });

export const Blog = mongoose.model<BlogDoc>('Blog', BlogSchema);
