/**
 * This script can be run from the command line using `npm run cli` in order to precompute
 * the points of a public key and log the result to the console.s
 *
 * Usage: `npm run cli <x> <y>`
 *
 * @example
 * // Precompute the points of a public key with x=123 and y=456
 * npm run cli 123 456
 */
import precomputePoints from "../dist/module.js";

try {
  // get the arguments passed to the script
  let [x, y] = process.argv.slice(2);

  // if no arguments are passed, throw an error
  if (!x || !y)
    throw new Error(
      "pass the x and y coordinates of the public key as arguments"
    );

  // try to convert the arguments to bigint then precompute the points and log the results
  precomputePoints(BigInt(Number(x)), BigInt(Number(y))).then(console.log);
} catch (e) {
  console.error(e);
  process.exit(1);
}
