require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");

const connectDB = require("./src/config/db");
const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");
const { getUserFromToken } = require("./src/graphql/auth");

async function start() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const user = token ? getUserFromToken(token) : null;
      return { user };
    },
    formatError: (err) => {
      // keep errors clean for assignment screenshots
      return {
        message: err.message,
        code: err.extensions?.code || "INTERNAL_ERROR",
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

start().catch((e) => console.error("❌ Server failed:", e));
