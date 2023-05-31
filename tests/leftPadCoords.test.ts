import { leftPadCoord } from "../src/utils";

// NOTE: These tests assume the length passed to leftPadCoord as
// the second argument will never be below 16 bytes. If this asumption
// does not hold, please take a look at the fuzzer below and the function itself
const fuzzer = () => {
  const lengthOptions = [16, 32, 64, 128];
  const NUMBER_OF_TESTS = 50;
  const PARAMS_TO_TEST: [number, number][] = new Array(NUMBER_OF_TESTS)
    .fill(0)
    .map(generateRandomNumbers);

  /**
   * Generates two random numbers: a coordinate between 1 and Number.MAX_SAFE_INTEGER,
   * and a length from a list of possible values (16, 32, 64, 128).
   * @returns An array containing the generated coordinate and length.
   */
  function generateRandomNumbers(): [number, number] {
    const coordinate = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1;
    const length =
      lengthOptions[Math.floor(Math.random() * lengthOptions.length)];
    return [coordinate, length];
  }

  /*//////////////////////////////////////////////////////////////
                                 TESTS
    //////////////////////////////////////////////////////////////*/
  it.each(PARAMS_TO_TEST)(
    "pads a fuzzed-digit hex value with zeros",
    (coordinate, length) => {
      const testValueStringify = BigInt(coordinate).toString(16);
      const expectedLeadingZeros = "0".repeat(
        length - testValueStringify.length
      );
      const result = leftPadCoord(BigInt(coordinate), length);

      expect(result).toEqual(`${expectedLeadingZeros}${testValueStringify}`);
    }
  );
};

describe("specific case", () => {
  it("pads a single-digit hex value with zeros", () => {
    const testedValue = 0x9;
    const testValueStringify = BigInt(testedValue).toString(16);
    const expectedLeadingZeros = "0".repeat(64 - testValueStringify.length);

    const result = leftPadCoord(BigInt(testedValue));

    expect(result).toEqual(`${expectedLeadingZeros}${testValueStringify}`);
  });

  it("pads a multi-digit hex value with zeros", () => {
    const testedValue = 0x2344556543453;
    const testValueStringify = BigInt(testedValue).toString(16);
    const expectedLeadingZeros = "0".repeat(64 - testValueStringify.length);

    const result = leftPadCoord(BigInt(testedValue));

    expect(result).toEqual(`${expectedLeadingZeros}${testValueStringify}`);
  });

  it("pads a multi-digit hex value to a custom length", () => {
    const testedValue = 0x111222;
    const testValueStringify = BigInt(testedValue).toString(16);
    const expectedLeadingZeros = "0".repeat(20 - testValueStringify.length);

    const result = leftPadCoord(BigInt(testedValue), 20);

    expect(result).toEqual(`${expectedLeadingZeros}${testValueStringify}`);
  });

  it("pads a multi-digit hex value to a 0 length", () => {
    const testedValue = 0xa9e2f2;
    const testValueStringify = BigInt(testedValue).toString(16);

    const result = leftPadCoord(BigInt(testedValue), 0);

    expect(result).toEqual(testValueStringify);
  });

  it("pads a multi-digit hex value longer than the length parameter", () => {
    const testedValue = 0xd1699002d9;
    const testValueStringify = BigInt(testedValue).toString(16);

    const result = leftPadCoord(BigInt(testedValue), 1);

    expect(result).toEqual(testValueStringify);
  });
});

describe("fuzzing", fuzzer);
