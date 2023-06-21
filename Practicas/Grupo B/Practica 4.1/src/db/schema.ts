import { ObjectId } from "mongo";
import { Coche, Concecionario, Vendedor } from "../types.ts";

export type VendedorSchema = Omit<Vendedor, "id"> & {
  _id: ObjectId;
};

export type CocheSchema = Omit<Coche, "id"> & {
  _id: ObjectId;
}; 

export type ConcecionarioSchema = Omit<Concecionario, "id"> & {
  _id: ObjectId;
};

