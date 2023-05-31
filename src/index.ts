import { secp256r1 } from "@noble/curves/p256";
import { leftPadCoord } from "./utils";

export type AffineProjectivePoint = ReturnType<typeof secp256r1.ProjectivePoint.fromAffine>;

// G is the generator of the curve
const G = secp256r1.ProjectivePoint.fromAffine({ x: secp256r1.CURVE.Gx, y: secp256r1.CURVE.Gy });

/**
 * Computes a table of precomputed points for use in the scalar multiplication algorithm.
 * @param {ProjPointType<bigint>} Q - The public key to use in the scalar multiplication.
 * @returns {Array<ProjectivePoint>} The precomputed table of points.
 */
function computePoints(Q: AffineProjectivePoint): AffineProjectivePoint[] {
  // Initialize Pow64_PQ and precomputedPoints arrays (will be filled later)
  // Pow64_PQ is a table of 8 points (G, G2, G3, G4, Q, Q2, Q3, Q4)
  let Pow64_PQ = Array(8).fill(Q);
  let precomputedPoints = Array(256).fill(secp256r1.ProjectivePoint.ZERO);

  // Set the first elements of Pow64_PQ to the generator of the curve (G)
  Pow64_PQ[0] = G;

  // Compute the powers of 64*Q and 64*G
  for (let j = 1; j <= 3; j++) {
    Pow64_PQ[j] = Pow64_PQ[j - 1].multiply(BigInt(2) ** BigInt(64));
    Pow64_PQ[j + 4] = Pow64_PQ[j + 3].multiply(BigInt(2) ** BigInt(64));
  }

  // Set the first element of precomputedPoints to 0*G. This is the only point that is not computed using the formula below.
  // It is important to note that this point will not be used, it is useless and only used to avoid dealing with an offset.
  // It is arbitrary, in this case we decided to set it to 0*G.
  precomputedPoints[0] = secp256r1.ProjectivePoint.ZERO;

  // Compute the powers of 2*G, 4*G, 8*G, ..., 128*G
  for (let i = 1; i < 256; i++) {
    precomputedPoints[i] = secp256r1.ProjectivePoint.ZERO;
    for (let j = 0; j < 8; j++) {
      if (i & (1 << j)) {
        // If the j-th bit of i is 1, then add 2**j*G to precomputedPoints[i]
        precomputedPoints[i] = Pow64_PQ[j].add(precomputedPoints[i]);
      }
    }
  }

  // Return the precomputed table of points
  return precomputedPoints;
}

/**
 * Concatenates the x and y coordinates of each point in an array of points into a single string.
 * @param {Array<{x: BigInt, y: BigInt}>} precomputedPoints - The array of points to concatenate.
 * @returns {string} The concatenated x and y coordinates as a hexadecimal string.
 */
export function concatenatePoints(precomputedPoints: AffineProjectivePoint[]): string {
  return precomputedPoints.reduce((accumulator, point, index) => {
    const px = leftPadCoord(point.x);
    const py = index === 0 ? leftPadCoord(point.py) : leftPadCoord(point.y);

    return `${accumulator}${px}${py}`;
  }, "");
}

export default async function getPrecomputedPoints() {
  // Load the C0 and C1 environment variables and convert them to BigInts
  const C0 = BigInt(process.env.C0);
  const C1 = BigInt(process.env.C1);

  // Get the public key using C0 and C1
  const Q = secp256r1.ProjectivePoint.fromAffine({ x: C0, y: C1 });

  // Precompute the points associated to the public key
  const precomputedPoints = computePoints(Q);

  // Concatenate the points into a single string
  const concatenated_points = concatenatePoints(precomputedPoints);

  return concatenated_points;
};
