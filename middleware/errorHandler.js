import CustomApiError from "../errors/customError.js";
import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next)=>{
    if (res.headersSent)return next(err);

    if (err instanceof CustomApiError){        
        return res.status(err.statusCode).json({success:false, msg:err.message})
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:err.message})
    
}