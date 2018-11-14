#!/bin/sh
rm -rf dist
babel src -d dist --copy-files --ignore "src/stories/**/*"
rm -r dist/stories && rm dist/setupTests.js && find dist -name "__snapshots__" -type d | xargs rm -r
find dist -name "*.test.js" | xargs rm
