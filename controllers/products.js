import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
import { Product } from "../model/productModel.js";
import { User } from "../model/userModel.js";
import BadRequest from "../errors/badRequest.js";
import unAuthorized from "../errors/unauthorized.js";

dotenv.config();

const createUser = async (req, res)=>{
    const {name, email, password, confirm} = req.body;
    
    const findUser = await User.exists({email:email});    
    if(findUser){
        throw new BadRequest ("Email already exist")
    }
    if (password !== confirm){
        throw new BadRequest("Password must match!")
    }    
    const userCreated = await User.create({
        name:name,
        email: email,
    })    
    res.status(201).json({userCreated})
}

const login = async (req, res)=>{
    const {email, password} = req.body;        
    
    if(!email || !password){
        throw new unAuthorized("Username or password cannot be empty")
    }    

    const user = await User.findOne({email}).select('+password')
    if(!user){
        throw new BadRequest("Invalid request!")
    }

    console.log(user);
    console.log(user.password);
    console.log(process.env.JSON_SECRET);

    const isMatch = await user.comparePassword(String(password))
    console.log(isMatch);
    if(!isMatch){
        throw new unAuthorized("Incorrect password.")
    }
    
    const Payload = {
      userId:user._id,
      name:user.name,
      role:user.role
    }
    const token = jwt.sign(Payload, process.env.JSON_SECRET, {expiresIn:'15d'})        
    res.status(200).json({success:true, msg:token})

}

const getAllProducts = async (req, res)=>{

    const allProducts = await Product.find({}).sort({company:'asc', price:'asc'}) 
    res.status(200).json({success:true, allProducts, length:allProducts.length})
}

const createProduct = async(req, res)=>{
    try {
        console.log(req.user.role);
    
        const {name,price, company, rating, createdAt, featured} = req.body;

       if (!company){
          return res.send({success:false, msg:"company field is invalid"})
       }    

       const newProducts = await Product.create({name:name,price:price, company:company, rating:rating, createdAt:createdAt, featured:featured})       
       return res.status(201).json({success:true, data:newProducts})
    } catch (error) {
          res.status(400).json({success:false, msg:error})
       }
}

const editProduct = async(req, res)=>{
    const {id} = req.params;
    if(id.length <=23){
        throw new BadRequest("Invalid ID")
    }

    const edit = await Product.findById(id);
    if(edit){    
      res.status(201).json({success:true, msg:edit})
    }
    throw new BadRequest("Invalid ID")

}
const deleteProduct = async(req, res)=>{
    const {id} = req.params;
    console.log(id.length <=23);
    
    if(id.length <=23){
        throw new BadRequest("Invalid ID")
    }
    const deleted = await Product.findByIdAndDelete(id);
    if(edit){    
      res.status(201).json({success:true, msg:`Item with ID ${id} deleted`})
    }
    throw new BadRequest("Invalid ID")

}

const getProductByName = async (req, res)=>{
    const {name} = req.params;

    const findProduct = await Product.find({name:{$regex:name, $options:'i'}})
    if (findProduct.length == 0){
        res.status(200).json({success:true, msg:"No product found"})
    }    
    res.status(200).json({success:true, msg:findProduct})
    
}

const filter = async (req, res)=>{
    const {nameItem, featuredItem, companyItem, sortByCompany,sortByPrice,fields, numericFilters} = req.query

    const queryObject = {}

    if(featuredItem){
        queryObject.featured = featuredItem
    }
    if(nameItem){ 
        queryObject.name = {$regex: nameItem, $options:'i'}
    }
    if(companyItem){
        queryObject.company = {$regex: companyItem, $options:'i'}
    }

        // add numeric filters
    if(numericFilters){
        const NumOperators = {
          '<':'$lt',
          '>':'$gt',
          '=':'$eq',
          '<=':'$lte',
          '>=':'$gte'
       }
      const regEx = /\b(<|>|=|<=|>=)\b/g
      let replaceOp = numericFilters.replace(regEx, (match)=>{          
          return `-${NumOperators[match]}-`
      })      
      const options = ['price', 'rating']
      
      const toArray = replaceOp.split(',').forEach((item)=>{
           const [field, op, value] = item.split('-');     

           if(options.includes(field)){       
              queryObject[field] = {[op]:Number(value)}
           }
       })      
    }    
    
    let result  = Product.find(queryObject)
    
    // sorts by ascending or descending order

    if(sortByPrice){
        result = result.sort({price:sortByPrice})
    }
    if(sortByCompany){
      result = result.sort({company:sortByCompany})
    }

    // select only necessar product data

    if(fields){
        const listToSort = fields.split(',').join(',');        
        result = result.select(listToSort)        
    }

    // add limit functionality
    const limits = req.query.limits || 10
    const pages = req.query.pages  || 1
    const skips = (pages-1)*limits     
    
    const products = await result.skip(skips).limit(limits)
    return res.status(200).json({products, length:products.length})
    
}
export {
    createUser,
    login,
    getAllProducts,
    createProduct,
    editProduct,
    deleteProduct,
    getProductByName,
    filter
}