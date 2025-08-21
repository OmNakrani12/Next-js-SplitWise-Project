import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type : String, required: true, unique:true},
    url: {type : String, required: true}
});

export const Users = mongoose.models.User || mongoose.model("User", userSchema);
