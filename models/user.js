const { createHmac, randomBytes } = require('crypto');
const { Schema, model } = require('mongoose');
const {createTokenForUser} = require("../services/authentication") 

const userSchema = new Schema({
   fullName: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   salt: {
      type: String,

   },

   password: {
      type: String,
      required: true,
   },
   profileImageURL: {
      type: String,
      default: "/images/default.png",

   },
   role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
   }

},
   { timestamps: true }
);

userSchema.pre("save", function (next) {
   const user = this;
   if (!user.isModified("password")) return;

   // Create a user secret key 16 digits 
   const salt = "someRanmSalt";
   // salt the password using secret key 
   const hashedPassword = createHmac('sha256', salt)
      .update(user.password)
      .digest('hex');
   this.salt = salt;
   this.password = hashedPassword;

   next();
});

userSchema.static('matchPasswordAndGenerateToken',
 async function (email, password) {
   const user = await this.findOne({ email });
   if (!user) throw new Error('User not found');
   
   const salt = user.salt;
   const hashedPassword = user.password;

   const userProvideHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

   if (hashedPassword !== userProvideHash) 
   throw new Error('Incorrect Password');

   // return { ...user._doc, password: undefined, salt: undefined };
  const token = createTokenForUser(user);
    return token; 

});

const User = model('user', userSchema);
module.exports = User;