const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email required."],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password required."],
    },
    modelType: {
        type: String,
        required: [false, "Model type required."],
    },
    oaiKey: {
        type: String,
        required: [false, "OAI key required."],
    },
    githubToken: {
        type: String,
        required: [false, "GitHub token required."],
    },
});

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    
});

module.exports = mongoose.model("User", userSchema);