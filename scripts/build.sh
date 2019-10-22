#!/usr/bin/env bash

# Configure to exit script as soon as a command fails.
set -o errexit

# Clean the existing build directory.
rm -rf build

rm -rf "ignored_contracts"
# Create a temporary directory to place ignored files (e.g. examples).
tmp_dir="ignored_contracts"
mkdir "$tmp_dir"

# Move the ignored files to the temporary directory.
while IFS="" read -r ignored
do
  mv "ignored_contracts" "$tmp_dir"
done < contracts/.npmignore

# Compile everything else.
npm run compile

# Return ignored files to their place.
if [ -z "$(ls -A $tmp_dir)" ]; then
  echo "Nothing to restore"
else
  mv "$tmp_dir/"* contracts/
fi
# Delete the temporary directory.
rmdir "$tmp_dir"
