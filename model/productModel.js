import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Product name is required."],
        trim: true
    },
    price:{
        type: Number,
        required:[true, "Product price is compulsory."]
    },
    company:{
        type: String,
        enum:{
            values:['Ikea', 'Caressa', 'Liddy', 'Marcos'],
            message: '{VALUE} is not supported'
        },
        required: [true, "Company name cannot be empty"]
    },
    rating:{
        type: Number,
        default: 4.5
    },
    createdAt:{
        type: Date,
        default:Date.now()
    },
    featured:{
        type: Boolean,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
})

export const Product = mongoose.model('Product', productSchema);

