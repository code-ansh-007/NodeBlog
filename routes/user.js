import { Router } from "express";
import User from "../models/user.js";

const router = Router();

// * redirects to signin page
router.get("/signin", (req, res) => {
  return res.render("signin");
});

// * redirects to signup page
router.get("/signup", (req, res) => {
  return res.render("signup");
});

// * creates a user
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({
      fullName,
      email,
      password,
    });
    return res.redirect("/user/signin");
  } catch (error) {
    console.log("Error: ", error.message);
    return res.render("signup", {
      error: "Email already exists!",
    });
  }
});

// * signs in a user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});

// * logs out a user
router.get("/logout", (req, res) => {
  return res.clearCookie("token").redirect("/");
});

export default router;
