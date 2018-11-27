#!/bin/sh
rm -rf dist
babel src -d dist --copy-files --ignore "src/stories/**/*"
node-sass dist -o dist
grep -e "\.scss" -r dist -l | xargs sed -i "" "s/\.scss/.css/g"
rm -r dist/stories && rm dist/setupTests.js && find dist -name "__snapshots__" -type d | xargs rm -r
find dist -name "*.test.js" | xargs rm
