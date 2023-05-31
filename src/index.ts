import { secp256r1 } from "@noble/curves/p256";
import { concatenatePoints, computePoints } from "./utils";

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
