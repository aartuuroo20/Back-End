import {ApolloServer} from "apollo"
import {startStandaloneServer} from "standalone";

import { Query } from "./resolvers/query.ts";
import { typeDefs } from "./Apolloschema.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Books } from "./resolvers/book.ts";
import { Autores } from "./resolvers/autores.ts";
import { Editoriales } from "./resolvers/editoriales.ts";

const resolvers = {
  Query,
  Mutation,
  Books,
  Autores,
  Editoriales
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses : false
})

const {url} = await startStandaloneServer(server,{
  listen: {port: 7777},
})
console.log(`Server running on: http://localhost:7777`);