import { secp256r1 } from "@noble/curves/p256";
import { computePoints } from "../src/utils";
import isPointOnCurve from "./utils/isPointOnCurve";

type AffineProjectivePoint = ReturnType<
  typeof secp256r1.ProjectivePoint.fromAffine
>;

const fuzzer = () => {
  const NUMBER_OF_TESTS = 5;

  // generate a list of random public keys before running the tests
  const PARAMS_RANDOM_PUBLIC_KEYS: AffineProjectivePoint[] = new Array(
    NUMBER_OF_TESTS
  )
    .fill(0)
    .map(generateRandomPubKey);

  /*//////////////////////////////////////////////////////////////
                                UTILS
    //////////////////////////////////////////////////////////////*/
  function generateRandomPubKey(): AffineProjectivePoint {
    const priv = secp256r1.utils.randomPrivateKey();
    return secp256r1.ProjectivePoint.fromPrivateKey(priv);
  }

  /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/
  it.each(PARAMS_RANDOM_PUBLIC_KEYS)(
    "ensure the precomputed points for a given public key is on the curve",
    (pubKey) => {
      const [pointZero, ...points] = computePoints(pubKey);

      // Check that the first point is the zero point defined by the curve
      expect(pointZero).toEqual(secp256r1.ProjectivePoint.ZERO);

      // Check that all the other points are on the curve
      points.forEach((point) => {
        const isOnCurve = isPointOnCurve(point.x, point.y);
        expect(isOnCurve).toBeTruthy();
      });
    }
  );
};

describe("fuzzing testing", fuzzer);
