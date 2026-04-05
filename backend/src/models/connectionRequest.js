const mongoose=require("mongoose");
const {Schema}=mongoose;

const connectionRequestSchema= new Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["pending","ignored","interested","accepted","rejected"],
            message: `{VALUE} is incorrect status type`,
        },
        required:true,
    }
},
{timestamps:true});

//composite index

connectionRequestSchema.index({fromUserId:1,toUserId:1});

// pre function to check if from and to user are same

connectionRequestSchema.pre("save", async function() {
    const connectionRequest = this;
    
    // Check if fromUserId and toUserId are the same
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error("You cannot send a request to yourself!");
    }
    // No need to call next() here!
});

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports=ConnectionRequest;