const mongoose=require("mongoose");
const {Schema}=mongoose;
require("dotenv").config;

const paymentSchema= new Schema({
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    paymentId:{
        type:String,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    amount:{
        type:Number,
        required:true,
        min:1,
    },
    currency:{
        type:String,
        required:true,
        default:"INR"
    },
    status:{
        type:String,
        enum:[ "created",
        "paid",
        "failed",
        "authorized",
        "captured",
        "started",
        "resolved",],
        default:"created"
    },

    receipt:{
        type:String,
        required:true,
    } ,

    notes:{
        firstName:{
            type:String,
        },
        lastName:{
            type:String
        },
        plan:{
            type:["Starter","Professional","Enterprise"],
        }
    }


}, {timestamps:true});

const Payment= mongoose.model("Payment",paymentSchema);

module.exports=Payment;