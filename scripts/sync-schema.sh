#!/usr/bin/env bash
# Copy the generated schema reference page from the awp repository, where
# `make schema` writes it from the wire package. Pass a path to a local
# checkout to copy from there instead of GitHub.
set -euo pipefail
root=$(cd "$(dirname "$0")/.." && pwd)
dest="$root/content/docs/reference/schema.mdx"
if [ $# -gt 0 ]; then
  cp "$1/schema/v0/schema.mdx" "$dest"
else
  curl -fsSL https://raw.githubusercontent.com/agentwireprotocol/awp/main/schema/v0/schema.mdx -o "$dest"
fi
echo "wrote $dest"
