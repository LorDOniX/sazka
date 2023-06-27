#!/bin/bash
rm -rf dist
node update-version.js
npm run build
# smazeme slozky pro rychlost
rm -fr ./dist/favicon
node upload.mjs remove-js-files
