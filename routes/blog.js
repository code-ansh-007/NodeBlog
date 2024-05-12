import { Router } from "express";
import Blog from "../models/blog.js";
import multer from "multer";
import path from "path";
import Comment from "../models/comment.js";
import User from "../models/user.js";

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

  const comments = await Comment.find({ blogRef: blogId }).populate(
    "createdBy"
  );

  comments.sort((a, b) => b.upVotes.length - a.upVotes.length);

  await Blog.findById(blogId)
    .populate("createdBy")
    .then((blog) => {
      res.render("blog-details", {
        blog,
        user: req.user,
        comments,
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

// ? Comment routes below

router.post("/comment/:blogId", async (req, res) => {
  const blogId = req.params.blogId;
  try {
    if (req.user) {
      await Comment.create({
        content: req.body.content,
        createdBy: req.user._id,
        blogRef: blogId,
      });
      res.redirect(`/blog/${blogId}`);
    } else {
      res.redirect("/user/signin");
    }
  } catch (error) {
    res.json({ message: "Error adding comment", error });
  }
});

// ?  ROute handler to handle ajax requests

const toggleCommentUpVote = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (comment.upVotes.includes(userId)) {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $pull: { upVotes: userId } },
      { new: true }
    );
  } else {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $addToSet: { upVotes: userId } },
      { new: true }
    );
  }
};

const toggleCommentDownVote = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (comment.downVotes.includes(userId)) {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $pull: { downVotes: userId } },
      { new: true }
    );
  } else {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      { $addToSet: { downVotes: userId } },
      { new: true }
    );
  }
};

router.post("/toggle-comment-upvote", (req, res) => {
  const commentId = req.body.commentId;
  const blogId = req.body.blogId;

  toggleCommentUpVote(commentId, req.user._id);
  res.redirect(`/blog/${blogId}`);
  // res.send("hello upvote");
});

router.post("/toggle-comment-downvote", (req, res) => {
  const commentId = req.body.commentId;
  const blogId = req.body.blogId;

  toggleCommentDownVote(commentId, req.user._id);

  res.redirect(`/blog/${blogId}`);
  // res.send("hello downvote");
});

export default router;
