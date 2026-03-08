import mongoose from "mongoose";
import validator from "validator"
import bcrypt from 'bcrypt'

const SALT_WORK_FACTOR = 10
const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required:[true, "Name field cannot be empty"],
        trim: true,
    },
    email:{
        type: String,
        required: [true, "Email field cannot be empty"],
        validate:{
            validator:function(value) {
                return validator.isEmail(value)
            },
            message:(props)=>`${props.value} is not a valid email address.`
        },
        unique: true
    },
    password:{
        type:String,
        required:[true, "Password cannot be empty"],
        select: false
        // select hides paasword by default in queries
    },
    role:{
        type:String,
        default: "seller"
    }
})


userSchema.pre('save', async function(){
    const user = this;
    if(!user.isModified('password')){
        return;
    }

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(user.password, salt)
    user.password = hash
    
})

userSchema.methods.comparePassword =async function(candidatePassword){
    const isMatch =await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}
export const User = mongoose.model('User', userSchema)