import { ObjectId } from "mongo";
import { Eventos } from "../types.ts";

export type EventosSchema = Omit<Eventos, "id"> & {
  _id: ObjectId;
};



