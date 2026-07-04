import { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    name: String,
    image: String,
    emailVerified: Date, // used by the Auth.js adapter
    role: { type: String, enum: ["student", "admin"], default: "student" },
    targetBand: { type: Number, min: 0, max: 9 },
    examDate: Date,
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = models.User || model("User", UserSchema);
