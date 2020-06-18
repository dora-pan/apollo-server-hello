const express = require("express");
const http = require("http");
const { ApolloServer, gql, PubSub } = require("apollo-server-express");
const { RESTDataSource } = require("apollo-datasource-rest");

const pubsub = new PubSub();
class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:5000/";
  }

  async getUserList(name) {
    const data = await this.get("api/list", {
      name,
    });
    return data.result;
  }

  async getUser(id) {
    return this.get(`api/${id}`);
  }
  async addUser(id, name, mobile) {
    const data = await this.post(`api/add`, {
      id,
      name,
      mobile,
    });
    return data.result;
  }
}

const BranchService = gql`
  type Branch {
    id: Int
    name: String
    address: String
  }
  extend type User {
    branch: Branch
  }
`;
const UserService = gql`
  type User {
    id: Int
    name: String
    mobile: String
  }
  extend type Branch {
    users: [User]
  }
  extend type Query {
    user(id: Int!): User
    users(name: String): [User]
  }
  extend type Mutation {
    addUser(id: Int, name: String, mobile: String): User
  }
  extend type Subscription {
    postAdded: User
  }
`;
const QueryService = gql`
  type Query {
    id: Int
  }
`;
const MutationService = gql`
  type Mutation {
    id: Int
  }
`;
const SubscriptionService = gql`
  type Subscription {
    id: Int
  }
`;

const server = new ApolloServer({
  typeDefs: [
    UserService,
    BranchService,
    QueryService,
    MutationService,
    SubscriptionService,
  ],
  resolvers: {
    Query: {
      user: (parent, args, context, info) => {
        const { dataSources } = context;
        const { id } = args;
        return dataSources.usersAPI.getUser(id);
      },
      users: (parent, args, context, info) => {
        const { dataSources } = context;
        const { name } = args;
        return dataSources.usersAPI.getUserList(name);
      },
    },
    Mutation: {
      addUser: (parent, args, context, info) => {
        const { dataSources } = context;
        const { id, name, mobile } = args;
        const ret = dataSources.usersAPI.addUser(id, name, mobile);
        pubsub.publish("POST_ADDED", {
          postAdded: ret,
        });
        return ret;
      },
    },
    Subscription: {
      postAdded: {
        subscribe: () => {
          return pubsub.asyncIterator(["POST_ADDED"]);
        },
      },
    },
  },
  subscriptions: {
    path: `/wsghl`,
  },
  dataSources: () => {
    return {
      usersAPI: new UsersAPI(),
    };
  },
});

const app = new express();
server.applyMiddleware({
  app,
  path: `/ghl`,
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(
  {
    port: 4000,
  },
  () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
    console.log(
      `Subscriptions ready at ws://localhost:4000${server.subscriptionsPath}`
    );
  }
);
