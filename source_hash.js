const { createHash } = require("crypto");
const fs = require("fs");
const path = require("path");

module.exports = function captureModuleCode() {
  const moduleCodeMap = new Map();
  const chunkFileNamesMap = new Map();

  return {
    name: "capture-module-code",
    transform(code, id) {
      moduleCodeMap.set(id, code);
    },
    generateBundle(options, bundle) {
      for (const [key, value] of Object.entries(bundle)) {
        if (value.type === "chunk") {
          const moduleCodes = Object.keys(value.modules)
            .map((id) => moduleCodeMap.get(id))
            .join("");
          const hash = createHash("md5")
            .update(moduleCodes)
            .digest("hex")
            .substr(0, 8);
          const newFileName = `${value.fileName.split(".")[0]}.${hash}.js`;
          chunkFileNamesMap.set(value.fileName, newFileName);
        }
      }
    },
    writeBundle(options, bundle) {
      for (const [key, value] of Object.entries(bundle)) {
        if (value.type === "chunk") {
          const filePath = path.join(options.dir, value.fileName);
          const newFileName = chunkFileNamesMap.get(value.fileName);
          for (let [oldFileName, newFileName] of chunkFileNamesMap.entries()) {
            value.code = value.code.replaceAll(
              oldFileName.split("/")[1],
              newFileName.split("/")[1]
            );
          }
          fs.writeFileSync(filePath, value.code);
          fs.renameSync(filePath, path.join(options.dir, newFileName));
        }
        if (value.fileName === "index.html") {
          const filePath = path.join(options.dir, value.fileName);
          let html = fs.readFileSync(filePath, "utf-8");
          for (let [oldFileName, newFileName] of chunkFileNamesMap.entries()) {
            html = html.replaceAll(
              oldFileName.split("/")[1],
              newFileName.split("/")[1]
            );
          }
          fs.writeFileSync(filePath, html);
        }
      }
    },
  };
};
