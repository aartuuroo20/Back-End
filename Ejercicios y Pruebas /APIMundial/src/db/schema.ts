import { ObjectId } from "mongo";
import { equipo, partido } from "../types.ts";

export type EquipoSchema = Omit<equipo, "id" | "golesFavor" | "golesContra" | "puntos" | "partidos"> & {
    _id: ObjectId,
}

export type PartidoSchema = Omit<partido, "id" | "equipo1" | "equipo2"> & {
    _id: ObjectId,
    equipo1: ObjectId,
    equipo2: ObjectId,
}
