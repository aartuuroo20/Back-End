import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    type Equipo {
        nombre: String!
        eliminado: Boolean!
        jugadores: [String]!
        golesFavor: Int!
        golesContra: Int!
        puntos: Int!
        partidos: Int!
    }

    type Partido {
        id: ID!
        equipo1: Equipo!
        equipo2: Equipo!
        golesEquipo1: Int!
        golesEquipo2: Int!
        estado: Status!
        time: Int!
    }

    enum Status {
        not_started 
        started 
        finished 
    }


    type Query {
        getPartidos(status: [Status!], equipo: ID): [Partido!]!
        getPartido(id: ID!): Partido
        getEquipo(id: ID!): Equipo
        getEquipos(eliminado: Boolean, jugando: Status): [Equipo!]!

    }

    type Mutation {
        addEquipo(nombre: String!, jugadores: [String]!): Equipo!
        addPartido(equipo1: ID!, equipo2: ID!): Partido!
        updatePartido(id: ID!, status: Status, equipo1: Int, equipo2: Int, time:Int): Partido!
    
    }



`
