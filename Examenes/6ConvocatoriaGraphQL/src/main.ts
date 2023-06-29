import {ApolloServer} from "apollo"
import {startStandaloneServer} from "standalone";

import { Query } from "./resolvers/query.ts";
import { typeDefs } from "./Apolloschema.ts";
import { Mutation } from "./resolvers/mutation.ts";


const resolvers = {
  Query,
  Mutation,
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