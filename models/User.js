import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  authToken: String,
  mobile: String,
  dbType: String,
});

const model = mongoose.model("User", userSchema);

export default model;
