const mongoose=require("mongoose");
const {Schema}=mongoose;
const jwt=require("jsonwebtoken");
const validator=require("validator");
require("dotenv").config;
const bcrypt=require("bcrypt");

const getRandomBanner = () => {
  const banners = [
    "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=1000&fit=crop",
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&fit=crop",
    "https://images.unsplash.com/photo-1504333638930-c8787321eee0?q=80&w=1000&fit=crop"
  ];
  // Returns a random URL from the array
  return banners[Math.floor(Math.random() * banners.length)];
};

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minLength:[3,"Username too small"],
        maxLength:[30,"Username too long"],
        lowercase:true,
        validate:{
            validator:function(value){
                return /^[a-zA-Z0-9_]+$/.test(value);
            },
            message:"Username can contains only alphabets , numbers and underscores"
        },
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        maxLength:[30,"First name too long"],
        match:/^[a-zA-Z]+(?:[a-zA-Z]+)*$/,
    },
    lastName:{
        type:String,
        trim:true,
        lowercase:true,
        maxLength:[30,"Last name too long"],
        match:/^[a-zA-Z]+(?:[a-zA-Z]+)*$/,
    },
    
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate:{
            validator:function(value){
            return validator.isEmail(value);
            },
            message:"Invalid email",
        },
        lowercase:true,
         minLength:[3,"Username too small"],
        maxLength:[30,"Username too long"],
    },

     password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value);
        },
        message: "Password is not strong",
      },
    },

    avatar: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: "Give string is not an URL",
      },
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    banner: {
        type:String,
        trim:true,
        validate:{
            validator:function(value){
            return validator.isURL(value);
        },
        message:"Given String is not an url",
    } , default:getRandomBanner,
    },
     headline: {
      type: String,
      maxLength: [220, "Too many words"],
      trim: true,
    },
    about: {
      type: String,
      maxLength: [1200, "Too many words"],
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: function () {
          return this.skills.length < 16;
        },
        message:
          "Too many skills, make number of skills less than or equal to 15",
      },
    }, role: {
      type: String,
      enum: ["admin", "moderator", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "deactivated", "banned"],
      default: "active",
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
      enum: ["free", "Starter", "Professional", "Enterprise"],
      default: "free",
    },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // users this user has blocked

},
{timestamps:true}
);

userSchema.index({firstName:1,lastName:1});
userSchema.index({skills:1});

// Text index for search functionality (supports $text queries)
userSchema.index(
  {
    username: "text",
    firstName: "text",
    lastName: "text",
    skills: "text",
    headline: "text",
    about: "text",
  },
  {
    name: "user_text_search_idx",
    weights: {
      username: 10,
      firstName: 8,
      lastName: 8,
      skills: 6,
      headline: 4,
      about: 2,
    },
  }
);

userSchema.methods.getJWT=function(){
    //create jwt
    const token=jwt.sign(
        {_id:this._id,role:this.role},
        process.env.secretJWT,
        {
            expiresIn:"3d",
        }
    );
    return token;
}

//validate password

userSchema.methods.validatePassword=async function(password){
    const isPasswordValid= await bcrypt.compare(password,this.password);
    return isPasswordValid;
};

const User=mongoose.model("User",userSchema);
module.exports=User;


