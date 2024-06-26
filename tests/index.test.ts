import precomputePoints from "../src";
import { secp256r1 } from "@noble/curves/p256";
import isPointOnCurve from "./utils/isPointOnCurve";
import fixtures from "./fixtures";

/**
 * Splits a concatenated string of x and y coordinates into an array of {x, y} points.
 * @param concatenedPoints The concatenated string of x and y coordinates.
 * @returns An array of {x, y} points.
 */
function chunkPrecomputedPoints(
  concatenedPoints: string
): { x: bigint; y: bigint }[] {
  const points: { x: bigint; y: bigint }[] = [];

  for (let i = 0; i < concatenedPoints.length; i += 256) {
    const concatenateCoords = concatenedPoints.slice(i, i + 128);
    const [x, y] = [
      concatenateCoords.slice(0, 64),
      concatenateCoords.slice(64),
    ];

    points.push({ x: BigInt(`0x${x}`), y: BigInt(`0x${y}`) });
  }

  return points;
}

describe("specific case", () => {
  it("the precompute points contain has the correct length", async () => {
    const priv = secp256r1.utils.randomPrivateKey();
    const pubKey = secp256r1.ProjectivePoint.fromPrivateKey(priv);
    const pointsStringify = await precomputePoints(pubKey.x, pubKey.y);

    // x and y are 32 bytes long, so 64 characters in the string representation
    // we generate 256 points, each point is the concatenation of x and y, so
    // 64 * 2 = 128 characters per point. We have 256 points, so 128 * 256 characters
    // in the string representation = 32768
    expect(pointsStringify.length).toEqual(64 * 2 * 256);
  });

  it("all precomputed points are on the curve", async () => {
    const priv = secp256r1.utils.randomPrivateKey();
    const pubKey = secp256r1.ProjectivePoint.fromPrivateKey(priv);
    const pointsStringify = await precomputePoints(pubKey.x, pubKey.y);

    // the first point (the point zero in our implementation) is not used
    const [, ...points] = chunkPrecomputedPoints(pointsStringify);

    points.forEach(({ x, y }) => expect(isPointOnCurve(x, y)).toBeTruthy());
  });

  // This test case checks that the precomputed points generated by the library are equal to
  // the precomputed points generated by the source implementation. The source implementation
  // is a SAGE script that can be found in the tests/differential/precomputation.sage file.
  // 200 random public keys and their associated 256 points have been generated by the SAGE script
  it.each(fixtures.data)(
    "the library is iso with the source implementation",
    async (signer) => {
      const { x, y } = signer.pubkey;
      const precomputedBySource = signer.points;
      const precomputedByLibrary = await precomputePoints(BigInt(x), BigInt(y));
      expect(precomputedByLibrary).toEqual(precomputedBySource);
    }
  );
});
