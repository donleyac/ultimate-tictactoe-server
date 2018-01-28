import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import resolvers from './resolvers';

const typeDefs = `
type Query {
  room(name: String): Room
  user(username: String): User
  allRooms: [Room]
  allUsers: [User]
}
type Mutation {
  addUser(username: String): User
  createRoom(name: String, username: String): Room
  joinRoom(name: String, username: String): Room
  leaveRoom(username:String): User
  truncateAll: User
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
