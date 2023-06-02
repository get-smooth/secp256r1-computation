# secp256r1 computation

![quality workflow](https://github.com/0x90d2b2b7fb7599eebb6e7a32980857d8/secp256r1-computation/actions/workflows/quality.yml/badge.svg?branch=main)
![unit-test workflow](https://github.com/0x90d2b2b7fb7599eebb6e7a32980857d8/secp256r1-computation/actions/workflows/tests.yml/badge.svg?branch=main)

## Description

This library is a powerful tool designed to enhance the performance of ECDSA signing and verification processes. It achieves this by generating a precomputed table of 256 points on the secp256r1 elliptic curve from a given public key. By optimizing point multiplication operations, our package significantly accelerates cryptographic computations, thus facilitating less costly elliptic curve digital signature algorithms.

## Installation

WIP

## Contributing

To contribute to this project, you need to have Node.js and npm installed on your system. You can download them from the official Node.js website: https://nodejs.org/

Once you have Node.js and npm installed, you can install the project's dependencies by running the following command in the project directory:

```sh
npm install
```

This will install the packages listed in the `dependencies` and `devDependencies` sections of the package.json file.

Now that you are ready to contribute, refer to the [contributing guidelines](./CONTRIBUTING.md) for more information.

### Building the project

The project uses [parcel](https://parceljs.org/) to build and bundle the code. To build the project, you can use the following command:

```sh
npm run build
```

> ℹ️ The build command targets an es2020 module. If you would like to see other targets supported, please feel free to open an issue.

### Git hooks

This project uses `Lefthook` to manage Git hooks. Git hooks are scripts that run automatically when certain Git events occur, such as committing code or pushing changes to a remote repository. `Lefthook` makes it easy to manage and run any type of scripts.

After installing the dependencies, you can configure the Git hooks by executing the following command in the project directory:

```sh
npm run hooks:install
```

This command installs a Git hook that runs Lefthook before pushing code to a remote repository.

Once the hook is installed, it will automatically run Lefthook before pushing code to a remote repository. If Lefthook fails, the push will be aborted.

To run Lefthook manually, you can use the following command:

```sh
npm run hooks
```

This will run all the Git hooks defined in the .lefthook.yml file.

#### Skipping git hooks

If you need to skip Lefthook on purpose, you can use the `CI=true` flag when running Git commands. For example, to skip Lefthook when pushing code, you can use the following command:

```sh
CI=true git push
```

## Usage

### As a library

Here's the signature of the function exposed by this library:

```ts
async function precomputePoints(x: bigint, y: bigint): Promise<string>;
```

The `bigint` type is the native JavaScript type for arbitrary-precision integers. It's used to represent the coordinates of the public key point Q.

The returned value is a string containing the precomputation table in JSON format. Each point in the table is the concantenation of the x and y coordinates, represented as hexadecimal strings. Each point is 64-bytes long, so the length of the returned string is 32768 characters.

Here's an example of how to use this library:

```ts
import { precomputePoints } from "secp256r1-computation";

const x = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefn;
const y = BitInt(42);

const table = await precomputePoints(x, y);
```

### As a CLI

This repository also exposes a script that can be used to generate the precomputation table from the command line. To use it, run the following command:

```sh
npm run cli <x> <y>
```

> ℹ️ Note that the script is a .mjs file. Consider using modern versions of nodejs to run it.

## Testing

This repository contains two different types of tests: unit tests and differential tests.

### Unit tests

The unit tests are located at the root of the `test` directory. They test the individual functions of the package in isolation. They are automatically run by GitHub Actions on every push to the `main`/`prod` branches and on every pull request that targets those branches. They are also automatically run by the git hook on every push to a remote repository if you installed it ([refer to the Git hooks section](#git-hooks)). Finally, you can also run them locally by executing the following command in the project directory:

```sh
npm run test
```

For you information, these tests are written using the [Jest](https://jestjs.io/) testing framework and use some fuzzing techniques to generate random inputs for the functions being tested. Also, some fixtures have been generated using the reference implementation of the algorithm to test edge cases. These fixtures are located in the [fixtures.json](./tests/fixtures.json) file.

### Differential tests

The differential tests are located in the `test/differential` directory. They test the package as a whole by comparing its output with the output of another implementation of the same algorithm. The reference implementation can be found [here](tests/differential/precomputation.sage). It's written by [rdubois-crypto](https://github.com/rdubois-crypto) in Sagemath. The reference implementation is considered to be correct, so the output of our library **must** match its output.

As the differential testing involves dependencies that are not installed by default in this repository because it is considered out-of-scope, these tests are not automatically run by GitHub Actions, nor the git hook. However, you can run them locally by executing the following command in the project directory:

```sh
npm run test:diff
```

Note you will need to install Sagemath on your system to run these tests. You can download it from the official Sagemath website: [https://www.sagemath.org/](https://doc.sagemath.org/html/en/installation/index.html)

> ℹ️ It is planned to incorporate these tests in the release workflow in the future. The library will be released only if the differential tests pass. It is also planned to add a GitHub Action that automatically runs the differential tests on every pull request that targets the `prod` branch exclusively.

## Notes

The current version of the library is opiniated. We would be happy to make the library more flexible in the future if there is a need for it. Here are some of the limitations of the current version:

- The project only supports the uncompressed point representation of the public key, without the unnecessary prefix
- The library strictly generates a table of **256** points. The representation of point is affine, each coordinates being encoded over 256 bits MSB (with leading 0's if necessary). It does not support generating a table of a different size for the moment
- The first point in the table is always the point at infinity (often called the "zero point") on the secp256r1 elliptic curve, in projective coordinates _(0, 1)_. This is not configurable for the moment

## Acknowledgements

Special thanks to [rdubois-crypto](https://github.com/rdubois-crypto) for developing the reference implementation [here](https://github.com/rdubois-crypto/FreshCryptoLib), and for the invaluable cryptographic guidance.

Kudos to [paulmillr](https://github.com/paulmillr) for the [@noble/curves](https://github.com/paulmillr/noble-curves) library. This library is build on top of it.
