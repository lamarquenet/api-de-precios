const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserToVerifySchema = new Schema({
  email: {type: String, unique: true, required: true},
  verificationString: {type: String, required: true}
});

const UserToVerify = mongoose.model("UserToVerify", UserToVerifySchema);

module.exports = UserToVerify;