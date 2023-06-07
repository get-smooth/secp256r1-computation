import { secp256r1 } from "@noble/curves/p256";
import precomputePoints from "../../src";
import execute from "../utils/execute";

describe("differential testing", () => {
    const NUMBER_OF_TESTS = 15;
    const TIMEOUT = 10_000;

    let x: string;
    let y: string;

    // generate a random public key before each tests
    beforeEach(() => {
        const priv = secp256r1.utils.randomPrivateKey();
        const pub = secp256r1.ProjectivePoint.fromPrivateKey(priv);

        x = pub.x.toString();
        y = pub.y.toString();
    })

    // we test than the nodejs implémentation returns the same result than the reference implémentation (SAGE)
    // this test runs $NUMBER_OF_TESTS times. Each time beforeEach is executed providing a new random public key
    // NOTE: it.each is expecting a array of arguments. Here I don't care about the arguments in my test, but I just this trick to run the test $NUMBER_OF_TESTS times
    it.each('.'.repeat(NUMBER_OF_TESTS).split(''))("returns the same precomputed points than the reference implementation", async () => {
        const [precomputedPointsBySage, precomputedPointsByNode] = await Promise.all([
            // execute the SAGE implementation
            execute(`export C0=${x}; export C1=${y}; sage tests/differential/precomputation.sage`),

            // execute the nodejs implementation
            precomputePoints(BigInt(x), BigInt(y))
        ]);

        // compare both implementation to ensure they are the same
        expect(precomputedPointsBySage).toEqual(precomputedPointsByNode);
    }, TIMEOUT);
});

