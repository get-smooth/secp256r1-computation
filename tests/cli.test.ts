import execute from "./utils/execute";
import fixtures from "./fixtures";

describe("cli", () => {
  it("test the cli script works as expected", async () => {
    // get a random fixture data from the list
    const { pubkey, points: referencePoints } =
      fixtures.data[Math.floor(Math.random() * fixtures.data.length)];

    // precompute the points using the cli script by providing the public key
    const precomputedPoints = (await execute(
      `node ./cli.mjs ${pubkey.x} ${pubkey.y}`
    )) as string;

    // check the precomputed points are the same than the reference points
    expect(precomputedPoints.trim()).toEqual(referencePoints);
  });
});
