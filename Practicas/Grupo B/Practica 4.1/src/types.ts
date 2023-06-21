export type Vendedor = {
    id: string,
    nombre: string,
    numeroEmpleado: string,
    email: string,
    coches: Coche[]
}

export type Coche = {
    marca: string,
    precio: number,
    matricula: string,
    sitios: number,
}

export type Concecionario = {
    ciudad: string,
    direccion: string,
    numeroDireccion: number,
    vendedores: Vendedor[]
}