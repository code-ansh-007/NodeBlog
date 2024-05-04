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
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

// * signs in a user
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = User.matchPassword(email, password);
    console.log("user", user);
    return res.redirect("/");
  } catch (error) {
    console.log("Error: ", error);
    res.status(404).json({ msg: error });
  }
});

export default router;
