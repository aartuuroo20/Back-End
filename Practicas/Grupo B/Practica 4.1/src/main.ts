import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
import { Server } from "https://deno.land/std@0.165.0/http/server.ts";
import { GraphQLHTTP } from "https://deno.land/x/gql@1.1.2/mod.ts";


import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { typeDefs } from "./schema.ts";
import { Vendedor } from "./resolvers/vendedor.ts";
import { Concecionario } from "./resolvers/concesionario.ts";

const resolvers = {
  Query,
  Mutation,
  Vendedor,
  Concecionario
};

const s = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    return pathname === "/graphql"
      ? await GraphQLHTTP<Request>({
          schema: makeExecutableSchema({ resolvers, typeDefs }),
          graphiql: true,
        })(req)
      : new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

s.listenAndServe();

console.log(`Server running on: http://localhost:3000/graphql`);

//deno run --import-map=./import_map.json --allow-all src/main.ts
//Tambien se puede ejecutar con deno task start