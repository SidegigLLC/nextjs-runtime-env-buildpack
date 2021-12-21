#!node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");

const placeholder =
  // eslint-disable-next-line quotes
  '"{{REACT_APP_VARS_AS_JSON}}"';
const prefix = process.env.JS_RUNTIME_ENV_PREFIX ?? "REACT_APP";
const pattern = process.env.JS_RUNTIME_TARGET_BUNDLE ?? "/app/build/_next/static/chunks/pages/_app-*.js";
const dir = pattern.substring(0, pattern.lastIndexOf("/"));
const filePattern = pattern.substring(pattern.lastIndexOf("/") + 1).split("-")[0];
let file;

fs.readdirSync(dir).forEach((path) => {
  if (path.startsWith(filePattern)) {
    file = path;
  }
});

const filePath = dir + "/" + file;
const contents = fs.readFileSync(filePath, { encoding: "utf-8" });
const env = Object.entries(process.env)
  .filter(([key]) => key.startsWith(prefix))
  .reduce((acc, [key, value]) => {
    acc[key.replace(prefix, "NEXT_PUBLIC")] = value;
    return acc;
  }, {});

const newContents = contents.replace(placeholder, "'" + JSON.stringify(env) + "'");

fs.writeFileSync(filePath, newContents, { encoding: "utf-8" });

console.log(prefix, pattern, dir, filePattern, filePath);
console.log(newContents);
console.log(JSON.stringify(env), JSON.stringify(process.env));
console.log(fs.readFileSync(filePath, { encoding: "utf-8" }));
