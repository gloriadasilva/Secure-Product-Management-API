import CustomApiError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next)=>{
    if (err instanceof CustomApiError){
        console.log(err);
        
        return res.status(err.statusCode).json({success:false, msg:err.message})
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "Sorry, an error occured, try again later"})
    
}