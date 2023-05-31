import { secp256r1 } from "@noble/curves/p256";

/**
* Checks whether a given point is on the secp256r1 elliptic curve.
* To do this, we check if y^2 ≡ x^3 + ax + b (mod p)
* @param point The point to check.
* @returns True if the point is on the curve, false otherwise.
*/
function isPointOnCurve(x: bigint, y: bigint) {
    // Calculate y^2 mod p
    const firstSide = y ** BigInt(2) % secp256r1.CURVE.p;

    // Calculate x^3 + ax + b mod p
    const secondSide = (
        x ** BigInt(3)
        + (secp256r1.CURVE.a * x)
        + secp256r1.CURVE.b
    ) % secp256r1.CURVE.p;

    // Check if y^2 mod p equals x^3 + ax + b mod p
    return firstSide === secondSide;
}

export default isPointOnCurve;
