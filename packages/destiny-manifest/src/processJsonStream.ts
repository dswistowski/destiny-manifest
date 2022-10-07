export const processJsonStream = async <R>(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onChunkCollected: (collected: R[]) => Promise<void>
) => {
  let charsReceived = 0;
  let data = "";

  for (;;) {
    const processed: (R & { hash: string })[] = [];
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    data += new TextDecoder().decode(value);

    let result: ReturnType<typeof findJsonObject>;
    do {
      result = findJsonObject(data);
      data = result.data;
      if (result.hash) {
        processed.push({ ...result.object, hash: result.hash });
      }
    } while (result.hash);
    charsReceived += value.length;
    console.debug(
      "chunk finished",
      charsReceived,
      "loaded",
      processed.length,
      "objects"
    );
    await onChunkCollected(processed);
  }
};

export const findJsonObject = (data: string) => {
  if (data[0] !== "{") {
    throw new Error("Not a json object");
  }
  const hash = findHash(data);
  if (hash === undefined) {
    return { data };
  }
  const pos = hash.end;
  if (data[hash.end + 1] !== ":" || data[hash.end + 2] !== "{") {
    return { data };
  }
  const json = findJson(data, pos + 2);
  if (json === undefined) {
    return { data };
  }
  const newData = `{${data.slice(json.end + 1)}`;
  return {
    object: JSON.parse(data.slice(pos + 2, json.end)),
    data: json.finished ? "{}" : newData,
    hash: hash.hash,
  };
};

export const findHash = (data: string) => {
  const match = data.match(/"(\d+)"/);
  if (!match) return;
  const hash = match[1];
  const start = data.indexOf(hash);
  const end = start + hash.length;
  return { hash, start, end };
};

export const findJson = (data: string, start = 0) => {
  let depth = 0;
  let i = start;
  for (; i < data.length; i++) {
    const char = data[i];
    if (char === "{") {
      depth++;
    } else if (char === "}") {
      depth--;
      if (depth === 0) {
        const nextChar = data[i + 1];
        if (nextChar === "," || nextChar === "}") {
          return {
            start,
            end: i + 1,
            data: data.slice(start, i + 1),
            finished: nextChar === "}",
          };
        } else {
          return undefined;
        }
      }
    }
  }
  return undefined;
};
