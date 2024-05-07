import mongoose, { Schema, model } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user", // ? in the reference we pass the name of the model which we want to refer to
    },
  },
  {
    timestamps: true,
  }
);

const Blog = model("blog", blogSchema);

export default Blog;
