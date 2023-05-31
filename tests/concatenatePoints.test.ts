import { concatenatePoints, leftPadCoord } from "../src/utils";
import { secp256r1 } from "@noble/curves/p256";

type ProjectivePoint = ReturnType<
  typeof secp256r1.ProjectivePoint.fromPrivateKey
>;
type AffineProjectivePoint = ReturnType<
  typeof secp256r1.ProjectivePoint.fromAffine
>;

const fuzzer = () => {
  const NUMBER_OF_TESTS = 20;
  const MAX_POINTS_IN_ARRAY = 15;
  // generate a list of random public keys before running the tests
  const PARAMS_RANDOM_PUBLIC_KEYS: ProjectivePoint[] = new Array(
    NUMBER_OF_TESTS
  )
    .fill(0)
    .map(generateRandomPubKey);
  // generate a list of a list of random points before running the tests
  const PARAMS_RANDOM_POINTS: AffineProjectivePoint[][] = new Array(
    NUMBER_OF_TESTS
  )
    .fill(0)
    .map(() => {
      const nbOfPoints = generateRandomNbOfPoints();
      return new Array(nbOfPoints).fill(0).map(() => {
        const pub = generateRandomPubKey();
        return { ...pub, x: pub.px, y: pub.py } satisfies AffineProjectivePoint;
      });
    });

  /*//////////////////////////////////////////////////////////////
                                UTILS
    //////////////////////////////////////////////////////////////*/
  function generateRandomPubKey(): ProjectivePoint {
    const priv = secp256r1.utils.randomPrivateKey();
    return secp256r1.ProjectivePoint.fromPrivateKey(priv);
  }

  function generateRandomNbOfPoints(): number {
    return Math.floor(Math.random() * MAX_POINTS_IN_ARRAY) + 1;
  }

  /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/
  it.each(PARAMS_RANDOM_PUBLIC_KEYS)(
    "concatenates the x and y coordinates of a single point",
    (pubKey) => {
      const points = [
        { ...pubKey, x: pubKey.px, y: pubKey.py },
      ] satisfies AffineProjectivePoint[];

      const result = concatenatePoints(points);
      expect(result).toEqual(
        `${leftPadCoord(pubKey.px)}${leftPadCoord(pubKey.py)}`
      );
    }
  );

  it.each([PARAMS_RANDOM_POINTS])(
    "concatenates the x and y coordinates of multiple points ",
    (points) => {
      const result = concatenatePoints(points);

      const expected = points.reduce((accumulator, point, index) => {
        const px = leftPadCoord(point.x);
        const py = index === 0 ? leftPadCoord(point.py) : leftPadCoord(point.y);
        return `${accumulator}${px}${py}`;
      }, "");

      expect(result).toEqual(expected);
    }
  );
};

describe("specific case testing", () => {
  it("returns an empty string for an empty array of points", () => {
    const points: AffineProjectivePoint[] = [];
    const result = concatenatePoints(points);
    expect(result).toEqual("");
  });
});

describe("fuzzing testing", fuzzer);
