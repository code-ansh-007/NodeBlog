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

function hashPassword(password, salt) {
  return createHmac("sha256", salt).update(password).digest("hex");
}

// ? the below function hashes the user's password when the user registers, and this function runs before the actual user document in saved in mongoDB
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return; // ? this function checks if the password has been already hashed earlier or not
  // ? password hashing logic
  const salt = randomBytes(16).toString();
  const hashedPassword = hashPassword(user.password, salt);
  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static("matchPassword", function (email, password) {
  const user = this.findOne({ email });
  if (!user) throw new Error("User not found");

  const salt = user.salt;
  const hashedPassword = user.password;
  const hashedAttempt = hashPassword(password, salt); // * hashing the password provided by the user during login to check whether the hashed version of the password matches with the hashed password stored in the DB
  if (hashedPassword !== hashedAttempt) throw new Error("Incorrect password!");

  return { ...user, password: undefined, salt: undefined };
});

const User = model("user", userSchema);

export default User;
