# secp256r1 computation

![quality workflow](https://github.com/0x90d2b2b7fb7599eebb6e7a32980857d8/secp256r1-computation/actions/workflows/quality.yml/badge.svg?branch=main)
![unit-test workflow](https://github.com/0x90d2b2b7fb7599eebb6e7a32980857d8/secp256r1-computation/actions/workflows/tests.yml/badge.svg?branch=main)

NOT STABLE YET -- IMPROVEMENTS/TESTS ARE COMING

## Description

This Node.js module generates a precomputation table for the secp256r1 elliptic curve, given a public key point Q. The precomputation table is used to speed up point multiplication operations during ECDSA signing and verification.
