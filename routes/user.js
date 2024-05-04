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
    return res.redirect("/");
  } catch (error) {
    console.log("Error: ", error.message);
  }
});

// * signs in a user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.matchPassword(email, password);
    if (user) return res.status(201).redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    return res.status(401).json({ msg: error });
  }
});

export default router;
