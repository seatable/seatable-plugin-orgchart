/**
 * local development settings (template file)
 */
export default {
  // dtable api token (required)
  APIToken: "<the api token for this base>",
  // server URL of the dtable of the plugin (required)
  server: "https://cloud.seatable.io",
  // id of the workspace with the dtable of the plugin (required, workspace must exist)
  workspaceID: 1,
  // name of the dtable to add the plugin to (required, dtable must exist under this name)
  dtableName: "<dtable-name>",
  // default language ('en' or 'zh-cn' are common, see "src/locale/index.js" for all lang keys)
  lang: "en",
};
