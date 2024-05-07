import { Router } from "express";
import Blog from "../models/blog.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

const router = Router();

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blogId = req.params.id;

  await Blog.findById(blogId)
    .then((blog) => {
      res.render("blog-details", {
        blog,
        user: req.user,
      });
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImageURL: req.file ? `/uploads/${req.file.filename}` : "na",
  });
  return res.redirect(`/blog/${blog._id}`);
});

export default router;
