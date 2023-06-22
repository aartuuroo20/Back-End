import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    type Editoriales {
        id: String!
        name: String!
        web: String!
        country: String!
        books: [Books!]!
    }

    type Autores {
        id: String!
        name: String!
        lang: String!
        books: [Books!]!
    }

    type Books {
        id: String!
        title: String!
        author: Autores!
        editorial: Editoriales!
        year: Int!
    }


    type Query {
       books: [Books!]!
       authors: [Autores!]!
       pressHourses: [Editoriales!]!
       book(id: String!): Books!
       author(id: String!): Autores!
       pressHourse(id: String!): Editoriales!
    }

    type Mutation {
        addPressHouse(name: String!, web: String!, country: String!): Editoriales!
        addAuthor(name: String!, lang: String!): Autores!
        addBook(title: String!, author: String!, editorial: String!, year: Int!): Books!
        deletePressHouse(id: String!): Editoriales!
        deleteAuthor(id: String!): Autores!
        deleteBook(id: String!): Books!
    }
`