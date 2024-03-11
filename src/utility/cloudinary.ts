import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Response } from 'express';

dotenv.config();

cloudinary.config({ 
    cloud_name: 'diwmlqcru', 
    api_key: '899923116237535', 
    api_secret: process.env.API_SECRET as string
});
const uploadFile = async (file: Express.Multer.File, res: Response) => {
    try {
        const response = await cloudinary.uploader.upload(file.path);
        return response;
    } catch (err) {
        return res.status(500).json({ err,message: 'Error in uploading', files: file });
    }
}

export default uploadFile;
