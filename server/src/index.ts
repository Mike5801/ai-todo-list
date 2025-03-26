// src/index.js
import dotenv from "dotenv";
import app from "./app";
import http from "http";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { WebSocketServer } from "ws";
import { makeServer } from "graphql-ws";
import { useServer } from "graphql-ws/use/ws";
import { expressMiddleware } from "@apollo/server/express4";
import { TaskResolver } from "./graphql/resolvers/task.resolver";
import { pubSub } from "./graphql/pubSub/pubsub";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    const httpServer = http.createServer(app);

    const schema = await buildSchema({
      resolvers: [TaskResolver],
      validate: false,
      pubSub: pubSub
    });

    const wsServer = new WebSocketServer({
      server: httpServer,
    });

    const serverCleanup = useServer({ schema }, wsServer);

    const apolloServer = new ApolloServer({
      schema,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
      ],
    });

    await apolloServer.start();

    app.use(
      "/graphql",
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ token: req.headers.token }),
      })
    );

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}/graphql`);
    });
  } catch (error: any) {
    console.error("Error starting the server:", error.message);
    throw new Error(error.message);
  }
}

main();
