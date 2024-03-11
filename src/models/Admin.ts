import mongoose, { Schema, Document } from 'mongoose';

interface AdminDoc extends Document {
    fullName: string;
    email: string;
    password: string;
    recoveryPassword: string;
  
}

const AdminSchema: Schema = new Schema({
    fullName: {
        type: String,
        required: false,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    recoveryPassword: {
        type: String,
        default: 0,
        required: false,

    }
}, { timestamps: true });;

export const Admin = mongoose.model<AdminDoc>('Admin', AdminSchema);
