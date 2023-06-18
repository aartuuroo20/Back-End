

export type User = {
    id: string,
    nombre: string,
    email: string,
    password: string,
    createdAt: Date,
    cart: string[]
}

export type Books = {
    id: string,
    titulo: string,
    autor: string,
    pages: number,
    isbn: string,
}

export type Author = {
    id: string,
    nombre: string,
    books: string[],
}