import { StatusCodes } from "http-status-codes"
import CustomApiError from "./customError.js";
class unAuthorized extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
export default unAuthorized;