import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  authToken: String,
  mobile: { type: String, unique: true },
  dbType: String,
});

const model = mongoose.model("User", userSchema);

export default model;
