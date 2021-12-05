import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  dbType: String,
  profileImage: String,
  address: String,
});

const model = mongoose.model("externalUser", userSchema);

export default model;
