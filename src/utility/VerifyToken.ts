import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Define the shape of the user object
interface User {
    email: string;
    fullName: string;
}

// Augment the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token =
            req.headers &&
            req.headers.authorization &&
            req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        try {
            const decoded: any = jwt.verify(token, "secret");

            const user: User = {
                email: decoded.email,
                fullName: decoded.fullName,
                
            };
            req.user = user;
            return next();
        } catch (error: any) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ error: "Token has expired" });
            } else {
                return res.status(401).json({ error: "You are not authorized" });
            }
        }
    } catch (error) {
        return res.status(401).json({ error: "You are not authorized" });
    }
};

export default isAuthenticated;
