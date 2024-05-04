import mongoose, { model } from "mongoose";
import { createHmac, randomBytes } from "crypto";

const userSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/placeholder.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// ? the below function hashes the user's password when the user registers, and this function runs before the actual user document in saved in mongoDB
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return; // ? this function checks if the password has been already hashed earlier or not
  // ? password hashing logic
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

const User = model("user", userSchema);

export default User;
