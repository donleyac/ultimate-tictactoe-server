import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  room(name: String): Room
  allRooms: [Room]
}
type Room {
  id: Int
  name: String
  users: [User]
}
type User {
  id: Int
  username: String
  room: Room
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export default schema;
