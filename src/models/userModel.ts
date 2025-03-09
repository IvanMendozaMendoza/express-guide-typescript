import mongoose, { Document } from "mongoose";
import validator from "validator";
const { isStrongPassword, isEmail } = validator;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [8, "Name must be at least 8 characters long"],
    maxlength: [50, "Name must be at most 50 characters long"],
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "Email is required"],
    validate: [isEmail, "Please provide a valid email address"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [
      isStrongPassword,
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    ],
  },
  confirmPassword: {
    type: String,
    required: [true, "Confirm password is required"],
    validate: {
      validator: function (
        this: Document & { password: string },
        value: string
      ): boolean {
        return this.password === value;
      },
      message: "Passwords do not match",
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
