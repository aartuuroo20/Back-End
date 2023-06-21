import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    type Character {
        id: String!
        name: String!
        status: String!
        species: String!
        type: String!
        gender: String!
        origin: Location!
        location: Location!
        image: String!
        episode: [Episode!]!
        created: String!
    }

    type Location {
        id: String!
        name: String!
        type: String!
        dimension: String!
        residents: [Character!]!
        created: String!
    }

    type Episode {
        id: String!
        name: String!
        air_date: String!
        episode: String!
        characters: [Character!]!
        created: String!
    }

    type Query {
        character(id: ID!): Character   
        charactersByIds(ids: [ID!]!): [Character]
    }
`