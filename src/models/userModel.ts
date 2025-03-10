import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import { compare, hash } from "bcryptjs";

interface UserSchema extends Document {
  name: string;
  email: string;
  photo?: string | null;
  password: string;
  confirmPassword: string;
  isValidPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserSchema>({
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
    validate: [validator["isEmail"], "Please provide a valid email address"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: [
      validator["isStrongPassword"],
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    ],
    select: false,
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

userSchema.pre<UserSchema>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this["password"] = await hash(this.password, 12);

  this["confirmPassword"] = "";
  next();
});

userSchema.methods["isValidPassword"] = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return await compare(candidatePassword, userPassword);
};

const User: Model<UserSchema> = mongoose.model("User", userSchema);

export default User;
