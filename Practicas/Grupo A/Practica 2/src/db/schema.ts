import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Coche } from "../types.ts";

export type CocheSchema = Omit<Coche, "id"> & {
  _id: ObjectId;
};