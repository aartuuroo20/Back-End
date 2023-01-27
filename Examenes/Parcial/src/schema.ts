import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";


export const typeDefs = gql`
    type Slots {
        day: Int!
        month: Int!
        year: Int!
        hour: Int!
        available: boolean,
        id_doctor: String!
        dni: String
    }

    type Query {
        getSlots(id: String!): Slots!
    }

    type Mutation {
        addSlot(day: Int!, month: Int!, hour: Int!, id_doctor: Int!): Slots!
    }
`