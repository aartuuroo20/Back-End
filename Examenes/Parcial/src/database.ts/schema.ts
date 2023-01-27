import { ObjectId } from "mongo";
import { Slots } from "../types.ts";
export type SlotSchema = Omit<Slots, "id"> & {_id: ObjectId}