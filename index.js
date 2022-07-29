const { ApolloServer } = require('apollo-server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { auth } = require('./auth/auth');

require('dotenv').config();

class AuthDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set("authed", context.authed ? JSON.stringify(context.authed) : null);
  }
}

const gateway = new ApolloGateway({
  buildService: ({ url }) => {
    return new AuthDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  context: async ({ req }) => {
    const authed = auth.authed(req);
    return { authed: authed };
  }
});

server
  .listen()
  .then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
  })
  .catch(err => {
    console.error(err);
  });