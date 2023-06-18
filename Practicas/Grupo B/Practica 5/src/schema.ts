import { gql } from "graphql_tag";


export const typeDefs = gql`

    type User {
        id: ID!
        username: String!
        token: String!
        idioma: String!
        fechaCreacion: String!   
    }

    type Message {
        id: ID!
        emisor: ID!
        receptor: ID!
        mensaje: String!
        fechaCreacion: String!
    }

    type Query {
        getMessages(page: Int!, perPage: Int!): [Message!]!
    }

    type Mutation {
        createUser(username: String!, password: String!): User!
        login(username: String!, password: String): String!
        deleteUser: User!
        sendMessage(receptor: String!, mensaje: String!): Message!
    }


`

