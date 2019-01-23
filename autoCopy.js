require("dotenv").config();
const notifier = require("node-notifier");
const fse = require("fs-extra");
const shell = require("shelljs");

const srcFilePath = process.env.THESIS_SRC_PATH;
const outputFilePath = process.env.THESIS_OUTPUT_PATH;
const confirmCopy = "Copy Thesis";
notifier.notify(
  {
    title: "Running autoCopy.js on thesis",
    message: "Do you want to backup your thesis now?",
    wait: true,
    closeLabel: "Do not copy",
    actions: confirmCopy
  },
  (err, response, metadata) => {
    if (err) {
      throw err;
    }
    if (metadata.activationValue !== confirmCopy) {
      process.exit(0);
    } else {
      copyThesis();
    }
  }
);

notifier.on("timeout", () => {
  notifier.notify({
    title: "timed out",
    message: "closing process"
  });
  process.exit(0);
});

let copyThesis = function() {
  fse
    .copy(srcFilePath, outputFilePath)
    .then(() => {
      shell.cd(`${outputFilePath}`);
      notifier.notify({
        title: "Success!",
        message: `Thesis was copied to ${outputFilePath}!`
      });
    })
    .catch(err => {
      console.log("Encountered an error:", err);
      notifier.notify({
        title: "Error",
        message: "Something went wrong when copying thesis"
      });
    });
};
