
import DBconnection from './services/Database';
import { PORT } from './configs';
import express, { Application, NextFunction, Request, Response } from 'express';
import { AdminRoutes, blogRoutes } from './routes';
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
export const app = express();

DBconnection();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/blog', blogRoutes)
app.use('/admin', AdminRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req: Request, res: Response) => {
    res.send({ message: "Hello from My Brand" })
});
export const server = app.listen(PORT, () => { // Capture the server instance
    console.log(`App is Listening on port ${PORT}`);
});

