export type Editoriales = {
    id: string,
    name: string,
    web: string,
    country: string,
    books: Books[],
}

export type Autores = {
    id: string,
    name: string,
    lang: string,
    books: Books[],
}

export type Books = {
    id: string,
    title: string,
    author: Autores,
    editorial: Editoriales,
    year: number,
}
