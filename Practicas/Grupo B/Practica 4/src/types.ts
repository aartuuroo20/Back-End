
import {ObjectId} from "mongo"

export type Vendedor = {
    nombre: String,
    numeroEmpleado: String,
    email: String,
    coches: Coche[]
}

export type Coche = {
    marca: String,
    precio: Number,
    matricula: String,
    sitios: Number,
}

export type Concesionario = {
    ciudad: String,
    direccion: String,
    numeroDireccion: Number,
    vendedores: Vendedor[]
}