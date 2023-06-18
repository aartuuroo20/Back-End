import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Author, Books, User } from "../types.ts";

export type UserSchema = Omit<User, "id"> & {
  _id: ObjectId;
};

export type BookSchema = Omit<Books, "id"> & {
  _id: ObjectId;
};

export type AuthorSchema = Omit<Author, "id"> & {
  _id: ObjectId;
};