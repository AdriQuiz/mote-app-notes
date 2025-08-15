const mongooose = require("mongoose");

const userSchema = new mongooose.Schema({
    fullName: { type: String },
    email: { type: String },
    password: { type: String },
    createdOn: { type: Date, default: new Date().getTime() }
});

module.exports = mongooose.model("User", userSchema);