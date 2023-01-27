import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Books, User, Author } from "../types.ts";

export type UserSchema = Omit<User, "ID"> & { _ID: ObjectId };
export type BooksSchema = Omit<Books, "ID"> & { _ID: ObjectId };
export type AuthorSchema = Omit<Author, "ID"> & { _ID: ObjectId };