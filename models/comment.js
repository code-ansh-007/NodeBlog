import mongoose, { Schema, model } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    blogRef: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    upVotes: {
      type: [],
    },
    downVotes: {
      type: [],
    },
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);

export default Comment;
