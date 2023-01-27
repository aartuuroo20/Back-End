import { gql } from "graphql_tag";


export const typeDefs = gql`

    type User {
        id: ID!
        username: String!
        token: String!
        autor: Boolean!
    }

    type Post  {
        id: ID!
        titulo: String!
        contenido: String!
        comentario: Comentario!
        autor: ID!,
        fecha: String!
    }

    type Comentario {
        id: ID!
        informacion: String!
        autor: ID!
        fecha: String!
    }

    type Query {
        getUser(token: String!): User!
        leerPost: [Post!]!
        leerComentario: [Comentario!]!
    }


    type Mutation {
        register(username: String!, password: String!, autor: Boolean): User!
        iniciarSesion(username: String!, password: String!): String!

        hacerComentario(post: ID!, informacion: String!, token: String!): Comentario!
        modificarComentario(id: ID!, informacionNueva: String!, token: String!): Comentario!
        borrarComentario(post: ID!, id: ID!, token: String!): Comentario!

        hacerPost(titulo: String!, contenido: String!, token: String!): Post!
        modificarPost(id: ID!, tituloNuevo: String, contenidoNuevo: String, token: String!): Post!
        borrarPost(id: ID!, token: String!): Post!

    }
   
`