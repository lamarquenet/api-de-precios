const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    FBname: {type: String},
    FBtoken: {type: String},
    email: {type: String, unique: true, required: true},
    locallyRegistered: {type: Boolean, required: true},
    language: {type: String},
    password: {type: String, required: true},
    date: {type: String, unique: true, default: Date.now},
    active:{type: Boolean, default: false},
    role:{type:String, default:"user"}
});

const User = mongoose.model("User", userSchema);

module.exports = User;