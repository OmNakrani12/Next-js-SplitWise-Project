import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type : String, required: true, unique:true},
    url: {type : String},
    password:{type: String},
    name : {type: String},
    provider: {type: String, default: "app-login"}
});

export const Users = mongoose.models.User || mongoose.model("User", userSchema);
