import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

usersSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

usersSchema.set("toJSON", {
  virtuals: true,
});

export const Users = mongoose.model("Users", usersSchema);
