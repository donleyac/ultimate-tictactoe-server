import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
import { importSchema } from 'graphql-import'
const typeDefs = importSchema('./server/schema.graphql')

const executableSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers,
});

export default executableSchema;
