import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    type Vendedor {
        _id: String!
        nombre: String!
        numeroEmpleado: String!
        email: String!
        coches: [Coche!]!
    }

    type Coche {
        _id: String!
        marca: String!
        precio: Int!
        matricula: String!
        sitios: Int!
    }

    type Concecionario {
        _id: String!
        ciudad: String!
        direccion: String!
        numeroDireccion: Int!
        vendedores: [Vendedor!]!
    }

    type Query {
        getCocheID(id: String!): Coche!
        getCocheRangoPrecio(min: Int!, max: Int!): [Coche!]!
        getVendedorNombre(nombre: String!): [Vendedor!]!
        getVendedorID(id: String!): Vendedor!
        getConcesionarioID(id: String!): Concecionario!
        getConcesinarios(paginas: Int!): [Concecionario!]!
    }

    type Mutation {
        addVendedor(nombre: String!, numeroEmpleado: String!, email: String!, concesionario: String!): Vendedor!
        addCoche(marca: String!, precio: Int!, matricula: String!, sitios: Int!, vendedor: String!): Coche!
        addConcecionario(ciudad: String!, direccion: String!, numeroDireccion: Int!): Concecionario!
        addCocheToVendedor(vendedorId: String!, cocheId: String!): Vendedor!
        addVendedorToConcecionario(concecionarioId: String!, vendedorId: String!): Concecionario!
    }
`