#!/bin/bash

usage() {
    echo "Usage: $(basename $0) <language> [npx]"
	echo "Options:"
	echo "		language: Required. ISO code of the language"
	echo "		npx: Optional. Provide only if you want to use npx."
    exit 1
}

if [ $# -ne 1 ]
then
	usage
fi

language=${1}
npx=${2}

# Check if language ISO code is provided
if [ -z "$language" ]; then
    usage
fi

# Check if Node is installed
node -v > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Node is not installed. Exiting..."
    exit 2
fi

# Run npm commands
CMD="${npx} npm run add-language ${language}"
$CMD
if [ $? -ne 0 ]; then
	echo "Command Failed: ${CMD}"
	exit 3
fi

CMD="${npx} npm run compile-language ${language}"
$CMD
if [ $? -ne 0 ]; then
	echo "Command Failed: ${CMD}"
	exit 4
fi

echo "Language Added Successfully!"
