import 'dotenv/config'
import { connectDB } from './db/store-products.js'
import { Product } from './model/productModel.js'
import { datas } from './products.js'

const connection = async (req, res)=>{
    try {
        await connectDB(process.env.MONGO_URL)
        await Product.deleteMany()
        await Product.create(datas)
        console.log("success");
        
        process.exit(0)
    } catch (error) {
        res.status(400).json({success:false, msg:error})
        
    }    
}

connection();

