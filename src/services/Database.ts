
import mongoose from 'mongoose';
export default async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB as string).then(result => {
            console.log("DB connected");
        }).catch(err => console.log('Error' + err))

    } catch (error) {
        console.log(error)
    }


}