import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Eventos } from "../types.ts";

export type EventosSchema = Omit<Eventos, "id"> & {
  _id: ObjectId;
};