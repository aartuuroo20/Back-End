import { ObjectId } from "mongo";
import { Message, User } from "../types.ts";

export type UserSchema = Omit<User, "id" | "token"> & {
    _id: ObjectId;
  };

  export type MessageSchema = Omit<Message, "id" | "token"> & {
    _id: ObjectId;
  };