import express,{Application, NextFunction, Request, Response} from 'express';
import { AdminRoutes, blogRoutes } from '../routes';
import cors from "cors";
import bodyParser from "body-parser";
import path from 'path'
export default async (app:Application) => {
    
app.use(express.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/blog',blogRoutes)
app.use('/admin',AdminRoutes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.get('/',(req:Request,res:Response)=>{
    res.send({message:"Hello from My Brand"})
});

return app
}

