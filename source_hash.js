const { createHash } = require("crypto");

module.exports = function captureModuleCode() {
  const moduleCodeMap = new Map();
  const chunkFileNamesMap = new Map();

  return {
    name: "capture-module-code",
    transform(code, id) {
      moduleCodeMap.set(id, code);
      return null;
    },
    generateBundle(options, bundle) {
      for (const [key, value] of Object.entries(bundle)) {
        if (value.type === "chunk") {
          const { modules } = value;
          const moduleCodes = Object.keys(modules)
            .map((id) => moduleCodeMap.get(id))
            .join("");
          const hash = createHash("md5")
            .update(moduleCodes)
            .digest("hex")
            .substr(0, 8);
          const newFileName = `${value.fileName.split(".")[0]}.${hash}.js`;
          chunkFileNamesMap.set(value.fileName, newFileName);
          value.fileName = newFileName;
        }

        for (const [key, value] of Object.entries(bundle)) {
          if (value.type === "chunk") {
            let { code } = value;
            for (let [
              oldFileName,
              newFileName,
            ] of chunkFileNamesMap.entries()) {
              if (oldFileName) {
                oldFileName = oldFileName.split("/").pop();
              }
              if (newFileName) {
                newFileName = newFileName.split("/").pop();
              }
              const regex = new RegExp(oldFileName, "g");
              code = code.replace(regex, newFileName);
            }
            value.code = code;
          }
        }
      }
    },
  };
};
