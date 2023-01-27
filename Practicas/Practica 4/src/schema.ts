import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
    type Vendedor {
        nombre: String!
        numeroEmpleado: String!
        email: String!
        coches: [Coche]!
    }

    type Coche {
        marca: String!
        precio: Int!
        matricula: String!
        sitios: Int!
    }

    type Concesionario{
        ciudad: String!
        direccion: String!
        numeroDireccion: Int!
        vendedores: [Vendedor] !
    }

    type Query{
        getCochesMatricula(matricula: String!): Coche!
        getCochesPrecio(max: Int!, min: Int!): [Coche]
        getVendedorNumeroEmpleado(id: String!): Vendedor
        getVendedoresNombre(nombre: String!): [Vendedor]
        getConcesionario(id: String!): Concesionario   
        getConcesionarios(paginas: Int!): [Concesionario]  
    }

    type Mutation{
        crearVendedor(nombre: String!, numeroEmpleado: String!, email: String!, concesionario: String, coches: String): Vendedor!
        crearCoche(marca: String!, precio: Int!, matricula: String!, sitios: Int!, vendedor: String): Coche!
        crearConcesionario(ciudad: String!, direccion: String!, numeroDireccion: Int!): Concesionario!
        actualizarCocheVendedor(coche: String!, vendedor: String!): Vendedor!
        actualizarVendedorConcesionario(empleado: String!, concesionario: String!): Concesionario!
    }



`;

