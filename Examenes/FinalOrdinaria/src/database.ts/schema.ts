import { ObjectId } from "mongo";
import { Character, episode } from "../types.ts";

export type charactersSchema = Omit<Character, "id"> & {
    _id: ObjectId;
  };

  export type episodeSchema = Omit<episode, "id"> & {
    _id: ObjectId
}