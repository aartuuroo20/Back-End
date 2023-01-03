import { User } from "../types.ts";
import { ObjectId } from "mongo";


export type UserSchema = Omit<User, "id" | "token"> & {
    _id: ObjectId;
  };


  export type BookSchema = Omit<User, "id"> & {
    _id: ObjectId;
  };