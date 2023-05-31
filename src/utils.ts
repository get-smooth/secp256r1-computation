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
