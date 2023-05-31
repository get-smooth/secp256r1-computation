import { secp256r1 } from "@noble/curves/p256";
import { concatenatePoints, computePoints } from "./utils";

export default async function precomputePoints(
  x: bigint,
  y: bigint
): Promise<string> {
  // Get the public key using x and y
  const pubKey = secp256r1.ProjectivePoint.fromAffine({ x, y });

  // Precompute the points associated to the public key
  const precomputedPoints = computePoints(pubKey);

  // Concatenate the points into a single string
  const concatenatedPoints = concatenatePoints(precomputedPoints);

  return concatenatedPoints;
}
