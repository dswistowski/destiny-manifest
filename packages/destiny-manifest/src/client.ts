export interface ClientResponse {
  readonly body: ReadableStream<Uint8Array> | null;
  json(): Promise<any>;
}

export const createBungieClient = (
  apiKey: string,
  urlRoot = "https://www.bungie.net"
) => {
  const client = async (path: string): Promise<ClientResponse> => {
    if (path.endsWith(".json")) {
      return await fetch(`${urlRoot}${path}`);
    }
    return await fetch(`${urlRoot}${path}`, {
      headers: {
        "X-API-Key": apiKey,
      },
    });
  };
  return client;
};

export type BungieClient = ReturnType<typeof createBungieClient>;
