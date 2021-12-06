import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobile: { type: String, unique: true },
  dbType: String,
  profileImage: String,
  address: String,
});

const model = mongoose.model("externalUser", userSchema);

export default model;
