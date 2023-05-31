import { secp256r1 } from "@noble/curves/p256";

export type AffineProjectivePoint = ReturnType<typeof secp256r1.ProjectivePoint.fromAffine>;

/**
 * Left-pads a coordinate with leading zeros to make it a fixed length.
 * @param {BigInt} coord - The coordinate to pad.
 * @param {number} n - The desired length of the padded coordinate (default: 64).
 * @returns {string} The padded coordinate as a hexadecimal string.
 */
export function leftPadCoord(coord: bigint, n = 64): string {
    // Convert coord to a hexadecimal string
    const hex_str = coord.toString(16);

    // Add leading zeros to the string to make it length n if needed
    return hex_str.padStart(n, "0");
};

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
};
