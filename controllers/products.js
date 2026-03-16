import dotenv from 'dotenv';
import { Product } from "../model/productModel.js";
import BadRequest from "../errors/badRequest.js";
import unAuthorized from '../errors/unauthorized.js';

dotenv.config();

const getAllProducts = async (req, res)=>{

    const allProducts = await Product.find({}).sort({company:'asc', price:'asc'}) 
    res.status(200).json({success:true, allProducts, length:allProducts.length})
}
const createProduct = async(req, res)=>{
    try {    
        const {name,price, company, rating, createdAt, featured} = req.body;

       if (!company){
          return res.send({success:false, msg:"company field is invalid"})
       }    

       const newProducts = await Product.create({name:name,price:price, company:company, rating:rating, createdAt:createdAt, featured:featured, owner:req.user._id

       })       
       return res.status(201).json({success:true, data:newProducts})
    } catch (error) {
          res.status(400).json({success:false, msg:error})
       }
}

const editProduct = async(req, res)=>{    
    const {id} = req.params;
    const {name, price, rating} = req.body;    
    
    // find id and update
    if(id.length <=23 || id.length >24){
        return res.status(400).json({success:false, msg:"Invalid ID"})
    }
    const findToEdit = await Product.findById(id)
    if(!findToEdit){
        throw new BadRequest("Product not found!")
    }
    
    if(findToEdit.owner != req.user._id){
        throw new unAuthorized("Cannot edit this product")
    }
    const product = await Product.findByIdAndUpdate(id, {name:name, price:price, rating:rating}, {returnDocument:"after"})
        
    return res.status(200).json({success:true, data:product})
}
const deleteProduct = async(req, res)=>{
    const {id} = req.params;
    if(id.length <=23 || id.length>24){
        throw new BadRequest("Invalid ID")
    }
    const product = await Product.findById(id);
    if(!product){
        throw new BadRequest("Product not found!")
    }
    if (product.owner !=req.user._id){
        throw new unAuthorized("Cannot delete this product!")
    }
    await Product.findByIdAndDelete(id)
    res.status(200).json({ success: true, msg: `Item with ID ${id} deleted` })

}

const getProductByName = async (req, res)=>{
    const {name} = req.params;
     
    const findProduct = await Product.find({name:{$regex:name, $options:'i'}})
    if (findProduct.length == 0){
        return res.status(200).json({success:true, msg:"No product found"})
    }    
    res.status(200).json({success:true, msg:findProduct})
    
}

const filter = async (req, res)=>{
    const {findName, findByPrice, findFeature, sortPrice, sortRatings, fields, numFilters} = req.query;

    let selectFields = ""
    let objectsQuery = {}
    let sortResult = {}

    if(findName){
        objectsQuery.name = {$regex: findName, $options:"i"}
    }
    if (findByPrice){
        objectsQuery.price = findByPrice
    }
    if (findFeature){
        objectsQuery.featured = findFeature
    }   
    
   
    if(numFilters){
        if(numFilters.includes('price')|| numFilters.includes('rating')){
          const match = numFilters.match(/(\w+)(>=|<=|>|<|=)(\d+)/);   
          if(!match){
            return res.status(400).json({success:false, msg: "Invalid operator sign"})
          }              
          const operatorMap = {
             ">": "$gt",
             "<": "$lt",
             ">=": "$gte",
             "<=": "$lte",
             "=":"$eq"
           };
           const mongooseQuery = {
                [match[1]]: {[operatorMap[match[2]]]: Number(match[3]),
                },
           };           
          objectsQuery = {...objectsQuery, ...mongooseQuery}
        }
        else{
            return res.status(401).json({success: false, msg:"Value must be price or ratings"})
        }
    }    
    
    if (sortPrice){
        if (sortPrice == 'asc' || sortPrice== 'desc'){
            sortResult.price = sortPrice
        }
        else{
            return res.status(401).json({success:false, msg:"value must be 'asc' or 'desc'"})
        }
    } 
    if (sortRatings){
        if (sortRatings == 'asc' || sortRatings== 'desc'){
            sortResult.ratings = sortRatings
        }
        else{
            return res.status(401).json({success:false, msg:"value must be 'asc' or 'desc'"})
        }
    } 
   // retrieve only selected fields
   if (fields){
    selectFields = fields.split(',').join(' ')
   }
   
   // limits
   const limit = Number(req.query.limit) || 10
   
   // pages
   const skip = req.query.skip|| 0
   try {
       const products = await Product
       .find(objectsQuery)
       .sort(sortResult)
       .select(selectFields)
       .limit(limit)
       .skip(skip)       

       return res.status(200).json({success:true, products, length:products.length})

   } catch (error) {
    return res.status(400).json({success:false, msg:error})
   }
    
}
export {
    getAllProducts,
    createProduct,
    editProduct,
    deleteProduct,
    getProductByName,
    filter
}