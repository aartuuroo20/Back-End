


export type User = {
    id: string,
    username: string,
    email: string, 
    password?: string,
    token?: string
}

export type Book = {
    id: string,
    name: string,
    author: string
}