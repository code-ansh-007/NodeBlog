import express from "express";
import path from "path";
import userRoute from "./routes/user.js";
import "dotenv/config";
import connectMongoDB from "./mongodb-connection.js";
import cookieParser from "cookie-parser";
import { checkForAuthenticationCookie } from "./middlewares/authentication.js";

const app = express();
const PORT = 3000;

// ? CONFIGURATION
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// ? connecting mongo db atlas
connectMongoDB(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("Error while connecting to mongoDB atlas", err);
  });

// ? middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

// ? Static ROUTES
app.get("/", (req, res) => {
  return res.render("home", {
    user: req.user,
  });
});

// ? ROUTES
app.use("/user", userRoute);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
