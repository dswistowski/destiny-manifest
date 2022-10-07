import { expect, test, describe } from "vitest";
import { murmurhash3_32_gc } from "./hash";

describe("hash", () => {
  test("should return a hash", () => {
    expect(murmurhash3_32_gc("foo", 0)).to.be.a("number");
    expect(murmurhash3_32_gc("foo", 0)).to.be.not.equal(
      murmurhash3_32_gc("foo1", 0)
    );
    expect(murmurhash3_32_gc("foo", 0)).to.be.not.equal(
      murmurhash3_32_gc("foo", 1)
    );
  });
});
