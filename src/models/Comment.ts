
import mongoose, { Schema, Document } from 'mongoose';

interface CommentDoc extends Document {
    comment: string;
    name: string;
    blog: mongoose.Types.ObjectId;
}

const CommentSchema: Schema = new Schema({
    comment: { type: String, required: true },
    name: { type: String, required: true },
    blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
}, { timestamps: true });

export const Comment = mongoose.model<CommentDoc>('Comment', CommentSchema);
