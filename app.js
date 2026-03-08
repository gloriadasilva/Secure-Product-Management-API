import express from 'express'
import routes from './routes/products.js';
import 'dotenv/config';

import { connectDB } from './db/store-products.js';

import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notfound.js';


const app = new express();

app.use(express.json())
app.use('/api/v1', routes)
app.use(errorHandler)
app.use(notFound)


const port = process.env.PORT|| 5000

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port,()=>{
            console.log('server is running ...');
            
        })
    } catch (error) {
        console.log(error);
    }
}

start();
