import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    scalar Date

    type Eventos {
        id: ID!
        titulo: String!
        descripcion: String
        fecha: Date!
        inicio: Int!
        fin: Int!
        invitados: [String!]!
    }

    type Query {
        events: [Eventos!]!
        event(id: String!): Eventos!
    }

    type Mutation {
        addEvent(titulo: String!, descripcion: String, fecha: String!, inicio: Int!, fin: Int!, invitados: [String]!): Eventos!
        deleteEvent(id: String!): Eventos!
        updateEvent(id: String!, titulo: String, descripcion: String, fecha: String, inicio: Int, fin: Int, invitados: [String]): Eventos!
    }
`