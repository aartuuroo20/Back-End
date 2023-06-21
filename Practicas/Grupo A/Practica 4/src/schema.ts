import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    type Slots {
        _id: ID!
        day: Int!
        month: Int!
        year: Int!
        hour: Int!
        available: Boolean!
        dni: String
    }

    type Query {
        availableSlots(day: Int, month: Int!, year: Int!): [Slots!]!
    }

    type Mutation {
        addSlot(day: Int!, month: Int!, year: Int!, hour: Int!): Slots!
        removeSlot(day: Int!, month: Int!, year: Int!, hour: Int!): Slots!
        bookSlot(day: Int!, month: Int!, year: Int!, hour: Int!, dni: String!): Slots!
    }
`