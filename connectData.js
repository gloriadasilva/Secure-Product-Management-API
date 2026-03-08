import 'dotenv/config'
import { connectDB } from './db/store-products.js'
import { Product } from './model/productModel.js'
import { datas } from './products.js'

const connection = async ()=>{
    try {
        await connectDB(process.env.MONGO_URL)
        await Product.deleteMany()
        await Product.create(datas)
        console.log("success");
        
        process.exit(0)
    } catch (error) {
        console.log(error);
        
    }    
}

connection();

// run node connecData.js