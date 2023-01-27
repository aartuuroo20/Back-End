import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Transacciones, Users } from "../types.ts";
import { UsersCollection } from "./db.ts";
import { TransactionsCollection } from "./db.ts";

export type UserSchema = Omit<Users, "ID"> & { _ID: ObjectId };
export type TransactionSchema = Omit<Transacciones, "ID_Sender" | "ID_Receiver"> & { _ID: ObjectId };