import { ObjectId } from "mongo";
import { Autores, Books, Editoriales } from "../types.ts";

export type EditorialesSchema = Omit<Editoriales, "id"> & {
  _id: ObjectId;
};

export type AutoresSchema = Omit<Autores, "id"> & {
  _id: ObjectId;
}; 

export type BooksSchema = Omit<Books, "id"> & {
  _id: ObjectId;
};


