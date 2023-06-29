import { ObjectId } from "mongo";
import { Autores, Books, Editoriales } from "../types.ts";

export type EditorialesSchema = Omit<Editoriales, "id" | "books"> & {
  _id: ObjectId;
  books: ObjectId[]
};

export type AutoresSchema = Omit<Autores, "id" | "books"> & {
  _id: ObjectId;
  books: ObjectId[]
}; 

export type BooksSchema = Omit<Books, "id" | "author" | "editorial"> & {
  _id: ObjectId;
  author: ObjectId,
  editorial: ObjectId,
};


