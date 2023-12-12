const JSZip = require("jszip");
const fs = require("fs-extra");
const path = require("path");
const dayjs = require("dayjs");
const paths = require("../config/paths");

const config = {
  dir: paths.appBuild + "/static/",
};

(async () => {
  const zip = new JSZip();

  zip.folder("task");
  zip.folder("task/media");

  const jsFilePath = await getFullFileName(config.dir + "js");
  const cssFilePath = await getFullFileName(config.dir + "css");

  zip.file("task/main.js", await getFileContent(jsFilePath));
  if (cssFilePath) {
    zip.file("task/media/main.css", await getFileContent(cssFilePath));
  }

  const iconExists = await isFileExist(paths.pluginConfigPath, "icon.png");
  if (iconExists) {
    const iconPath = path.join(paths.pluginConfigPath, "icon.png");
    zip.file("task/media/icon.png", await fs.readFile(iconPath));
  }

  const cardImageExists = await isFileExist(
    paths.pluginConfigPath,
    "card_image.png"
  );
  if (cardImageExists) {
    const cardImagePath = path.join(paths.pluginConfigPath, "card_image.png");
    zip.file("task/media/card_image.png", await fs.readFile(cardImagePath));
  }

  const pluginInfoFilePath = path.join(paths.pluginConfigPath, "info.json");
  const pluginInfoContent = JSON.parse(
    await getFileContent(pluginInfoFilePath)
  );

  const pluginInfoContentExpand = {
    last_modified: dayjs().format(),
    has_css: cssFilePath ? true : false,
    has_icon: iconExists,
    has_card_image: cardImageExists,
  };

  const jsonFileContent = { ...pluginInfoContent, ...pluginInfoContentExpand };
  zip.file("task/info.json", JSON.stringify(jsonFileContent, null, "  "));

  try {
    const content = await zip.generateAsync({ type: "nodebuffer" });
    const zipFileName = `${pluginInfoContent.name}-${pluginInfoContent.version}.zip`;
    await fs.writeFile(path.join(paths.zipPath, zipFileName), content);
    console.log(zipFileName + " successful");
  } catch (err) {
    console.log(err);
  }
})();

async function isFileExist(overallPath, fileName) {
  try {
    const files = await fs.readdir(overallPath);
    return files.includes(fileName);
  } catch (err) {
    return false;
  }
}

async function getFullFileName(overallPath) {
  try {
    const files = await fs.readdir(overallPath);
    const moduleFileExtensions = ["js", "css"];
    const fileName = files.find((fileItem) => {
      const extension = fileItem.substring(fileItem.lastIndexOf(".") + 1);
      return moduleFileExtensions.includes(extension);
    });
    return fileName ? path.join(overallPath, fileName) : null;
  } catch (err) {
    return null;
  }
}

async function getFileContent(overallPath) {
  try {
    const content = await fs.readFile(overallPath, { encoding: "utf-8" });
    return content;
  } catch (err) {
    return null;
  }
}
