import { ObjectId } from "mongo";
import { Slots } from "../types.ts";

export type SlotsSchema = Omit<Slots, "id"> & {
  _id: ObjectId;
};

