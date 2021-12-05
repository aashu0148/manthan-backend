import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  desc: String,
  date: Date,
  image: String,
  userId: String,
});

const model = mongoose.model("Post", postSchema);

export default model;
