import express from 'express';
import App from './services/ExpressApp';
import DBconnection from './services/Database';
import { PORT } from './configs';

const StartServer  = async () =>{
    const app = express();
    await DBconnection();

    await App(app);
    app.listen(PORT,()=>{
        console.log(` App is Listening on port ${PORT}`)
    })
}

StartServer()

