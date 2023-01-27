

import { ObjectId } from "mongo";
import { Comentario, Post, User } from "../types.ts";

export type UserSchema = Omit<User, "id" | "token"> & {
    _id: ObjectId;
  };

  export type PostSchema = Omit<Post, "id" | "comentario"> & {
    _id: ObjectId;
    comentario: ObjectId
  };

  export type ComentarioSchema = Omit<Comentario, "id"> & {
    _id: ObjectId;
  };