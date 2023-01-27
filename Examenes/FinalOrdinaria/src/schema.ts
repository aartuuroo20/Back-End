import { gql } from "graphql_tag";


export const typeDefs = gql`

   enum Status {
      alive
      death
      unknown
  }

  enum Gender {
      male
      female
      unknown
  }

  type Loc  {
      name: String!
      url: String!
  }

  type Info {
      count: Int!
      pages: Int!
      next: String!
      prev: String!
  }

   type Character {
    id: ID!
    name: String!
    status: Status!
    species: String!
    type: String!
    gender: Gender!
    origin: Loc!
    location: Loc!
    image: String!
    episode: [String!]!
    url: String!
    created: String!
    
    }

    type CharactersData  {
        info: Info!
        results: [Character]!
    }

    type episode {
        id: ID!
        name: String!
        air_date: String!
        characters: [Character!]!
        created: String!
    }
   

   type Query {
      character(id: ID!): Character!
      charactersByIds(ids: [ID!]!): [Character!]!

   }
`