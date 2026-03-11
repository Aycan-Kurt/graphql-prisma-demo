import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
//3
const typeDefs = `#graphql
  type Task {
    id: Int!
    title: String!
    done: Boolean!
  }

  type Query {
    tasks: [Task!]!
  }

  type Mutation {
    createTask(title: String!): Task!
    updateTask(id: Int!, title: String, done: Boolean): Task!
    deleteTask(id: Int!): Task!
  }
`;
//5
const resolvers = {
  Query: {
    tasks: async () => {
      return prisma.task.findMany();
    }
  },

  Mutation: {
    createTask: async (_, args) => {
      return prisma.task.create({
        data: {
          title: args.title
        }
      });
    },

    updateTask: async (_, args) => {
      return prisma.task.update({
        where: { id: args.id },
        data: {
          title: args.title,
          done: args.done
        }
      });
    },

    deleteTask: async (_, args) => {
      return prisma.task.delete({
        where: { id: args.id }
      });
    }
  }
};
//6
const server = new ApolloServer({
  typeDefs,
  resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
});

console.log(`Server ready at ${url}`);