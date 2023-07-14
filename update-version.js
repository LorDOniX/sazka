const file = './package.json';
const PACKAGE = require(file);
const fs = require("fs");
const version = PACKAGE.version.toString();
const parts = version.split(".").map(item => parseFloat(item));
parts[2]++;

if (parts[2] >= 10) {
	parts[1]++;
	parts[2] = 0;
}

const newVersion = parts.join(".");
PACKAGE.version = newVersion;
console.log(`Update version ${version} -> ${newVersion}`);
fs.writeFileSync(file, JSON.stringify(PACKAGE, null, "\t"), "utf-8");
