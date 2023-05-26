/*
 ** This file can be used to generate a random public key.
 ** It is used in the bash script (./compare.sh) to compare different implementations.
 */
const { secp256r1 } = require("@noble/curves/p256");

const priv = secp256r1.utils.randomPrivateKey();
const pub = secp256r1.ProjectivePoint.fromPrivateKey(priv);

// this line is eval in the bash script (./compare.sh)
// that way C0 and C1 are exported as environment variables
console.log(`export C0=${pub.x.toString()}; export C1=${pub.y.toString()};`);
