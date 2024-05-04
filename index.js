import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());

app.get("/", (req, res) => {
  return res.render("home");
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
