import { describe, expect, test } from "vitest";
import {
  findHash,
  findJson,
  findJsonObject,
  processJsonStream,
} from "./processJsonStream";

describe("findHash", () => {
  test("findHash", () => {
    expect(findHash('{"42"')).toMatchObject({ hash: "42", start: 2, end: 4 });
  });
  test("findHash, not present", () => {
    expect(findHash('{"some-other-text"')).toBeUndefined();
  });
});

describe("findJson", () => {
  test("can find json", () => {
    expect(findJson('{"42":{}},...')).toMatchObject({
      start: 0,
      end: 9,
      data: '{"42":{}}',
    });
  });
  test("can find json, not present", () => {
    expect(findJson('{"42":{} something next', 10)).toBeUndefined();
  });
  test("can skip i first characters", () => {
    expect(findJson('1234{"42":{"foo": "bar"}},..', 4)).toMatchObject({
      start: 4,
      end: 25,
      data: '{"42":{"foo": "bar"}}',
    });
  });
});

describe("findJsonObject", () => {
  test("should fail if not valid", () => {
    expect(() => findJsonObject("")).toThrow();
    expect(() => findJsonObject('"')).toThrow();
    expect(() => findJsonObject("{")).not.toThrow();
  });
  test("should find json", () => {
    const result = findJsonObject('{"42"');
    expect(result).toMatchObject({ data: '{"42"' });
  });
  test("should find json", () => {
    const result = findJsonObject('{"1234":{"foo": "bar"},...');
    expect(result).toMatchObject({ data: "{..." });
  });
  test("should find json in finished", () => {
    const result = findJsonObject('{"1234":{"foo": "bar"}}');
    expect(result).toMatchObject({
      data: "{}",
      hash: "1234",
      object: { foo: "bar" },
    });
  });
});

const reader = (chunks: string[]) => {
  const enc = new TextEncoder();
  return {
    read: async () => {
      if (chunks.length) {
        return { value: enc.encode(chunks.shift()), done: false };
      }
      return { done: true };
    },
  };
};

describe("findJsonObject", () => {
  test("should be able to process a stream", async () => {
    const allData = [];

    const result = processJsonStream<any>(
      reader(['{"123', '":{"x": ', '42},"456":{"y"', ": 43}}"]) as any,
      async (data) => {
        allData.push(data);
      }
    );
  });
});
