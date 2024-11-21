import { createClient, fetchExchange, subscriptionExchange } from "urql";
import { createClient as createWebSocketClient } from "graphql-ws";

const webSocketClient =
  typeof window !== "undefined"
    ? createWebSocketClient({
        url: "ws://next-werewolf-59.hasura.app/v1/graphql",
      })
    : null;

export const urqlClient = createClient({
  url: "https://next-werewolf-59.hasura.app/v1/graphql",
  exchanges: [
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query || "" };
        return {
          subscribe(sink) {
            const unsubscribe = webSocketClient.subscribe(input, sink);
            return { unsubscribe };
          },
        };
      },
    }),
  ],
});
