import { Request, Response, NextFunction } from 'express';
import { Admin } from '../models/Admin'; // Assuming Admin is your Mongoose model
import { GeneratePassword, GenerateSalt, comparePassword } from '../utility/passwordUtility';
import { CreateAuthPayload } from '../dto/Auth.dto'; // Assuming you have defined these interfaces
import { signToken } from '../utility/Authentication';


export const CreateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, fullName, password, recoveryPassword } = req.body as CreateAuthPayload;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.json({ "Message": "Admin already exists" });
    }

    // Generate salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const userRecPassword = await GeneratePassword(recoveryPassword, salt);

    const CreatedAdmin = await Admin.create({
        email,
        fullName,
        password: userPassword,
        recoveryPassword:userRecPassword,
    });


    return res.json(CreatedAdmin);
}

export const Login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isPasswordValid = await comparePassword(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const { fullName} = admin
        return res.status(200).json({ message: "Login successful",fullName, token: signToken({email,fullName}) });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const GetAdmin = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const admin = await Admin.find();

        if (!admin) {

            return res.status(200).json({ message: "No Admin ", admin });
        }
        return res.status(200).json({ message: "Admin fetched successful", admin });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

