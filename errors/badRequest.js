
import CustomApiError from "./customError.js";
import { StatusCodes } from "http-status-codes";
class BadRequest extends CustomApiError{
    constructor(message){
        super (message)
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export default BadRequest;