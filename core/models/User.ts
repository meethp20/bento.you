import mongoose, { Schema, models, model } from "mongoose";

const LayoutCoordSchema = new Schema(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
  { _id: false },
);

const BlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    w: { type: Number, required: true, default: 1 },
    h: { type: Number, required: true, default: 1 },
    layouts: {
      desktop: { type: LayoutCoordSchema },
      mobile: { type: LayoutCoordSchema },
    },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    blocks: { type: [BlockSchema], default: [] },
    theme: { type: String, default: "hero" },
  },
  { timestamps: true },
);

// Prevent overwrite during hot reload
const User = models.User || model("User", UserSchema);

export default User;
