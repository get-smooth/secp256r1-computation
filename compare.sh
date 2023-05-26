#!/bin/bash

# This script generates random values for C0 and C1, runs a Node.js script and
# a Sage script to compute a precomputation table, and compares the output of the
# two scripts to ensure they are equivalent. The script accepts a single
# optional argument (-v) to enable verbose output.
# Usage: compare.sh [-v]

# generate random values for C0 and C1
eval $(node ./src/utils/generator.js)
echo -n "C0: "
echo $C0
echo -n "C1: "
echo $C1
echo

# Parse the command-line arguments
while getopts "v" opt; do
    case ${opt} in
    v)
        verbose=true
        ;;
    \?)
        echo "Usage: compare.sh [-v]"
        exit 1
        ;;
    esac
done

# Run the Node.js script and store the output in a variable
node_output=$(node src/precomputation.js)
if [ "$verbose" = true ]; then
    echo "Node output length: ${#node_output}"
    echo
    echo "Node output"
    echo "$node_output"
    echo "----------------------"
fi

# Run the Sage script and store the output in a variable
sage_output=$(sage src/sage/precomputation.sage)
if [ "$verbose" = true ]; then
    echo "Sage output length: ${#sage_output}"
    echo
    echo "Sage output"
    echo "$sage_output"
    echo "----------------------"
fi

# Compare the output of the two scripts
if [ "$node_output" = "$sage_output" ]; then
    echo "The outputs are equivalent ✅"
else
    echo "The outputs are not equivalent ❌"
fi
