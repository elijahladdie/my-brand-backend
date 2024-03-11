
import mongoose from 'mongoose';
import { MONGO_DB } from '../configs';


export default async () => {

    try {
        await mongoose.connect(MONGO_DB).then(result => {
            console.log("DB connected");
        }).catch(err => console.log('Error' + err))

    } catch (error) {
        console.log(error)
    }


}