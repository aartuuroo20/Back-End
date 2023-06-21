import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Users } from "../types.ts";
import { Transactions } from "../types.ts";

export type UsersSchema = Omit<Users, "id"> & {
  _id: ObjectId;
};

export type TransactionsSchema = Omit<Transactions, "id"> & {
  _id: ObjectId;
};