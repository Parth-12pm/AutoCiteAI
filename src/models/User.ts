import mongoose , { Schema,model,models }  from "mongoose";
import bcrypt from "bcrypt";
import { IChats } from "./Chats";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  password: string;
  chats?: mongoose.Types.ObjectId[] | IChats[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chats",
        required: true,
        default: [],
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User ||  model<IUser>("User", UserSchema);

export default User; 