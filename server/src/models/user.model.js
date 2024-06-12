import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone:{
      type:String,
      required:true,
    },
    email: {
      type: String,
      required: true,
    },
    collegeEmail: {
      type: String,
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//  hash the pswd

userSchema.pre("save", async function (next) {
  //console.log("pre method",this)
  const user = this;
  if (!user.isModified("password")) {
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.password, saltRound);
    user.password = hash_password;
  } catch (error) {
    next(error);
  }
});

// compare password

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// json web token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const User = mongoose.model("User", userSchema);
export default User;
