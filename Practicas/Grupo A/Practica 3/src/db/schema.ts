import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Slots } from "../types.ts";

export type SlotsSchema = Omit<Slots, "id"> & {
  _id: ObjectId;
};
