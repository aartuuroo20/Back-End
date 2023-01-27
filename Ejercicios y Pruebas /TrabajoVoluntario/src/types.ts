


export type User = {
    id: string,
    username: string,
    password?: string,
    token?: string,
    autor: boolean
}

export type Post = {
    id: string,
    titulo: string,
    contenido: string,
    comentario: Comentario,
    autor: string,
    fecha: Date
}

export type Comentario = {
    id: string,
    informacion: string,
    autor: string,
    fecha: Date
}