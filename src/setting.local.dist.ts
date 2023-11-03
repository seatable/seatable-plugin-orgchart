/**
 * local development settings
 */
export default {
  // dtable api token (required)
  APIToken:  process.env.REACT_APP_API_TOKEN,
  // server URL of the dtable of the plugin (required)
  server: 'https://stage.seatable.io',
  // id of the workspace with the dtable of the plugin (required, workspace must exist)
  workspaceID: process.env.REACT_APP_WORKSPACE_ID,
  // name of the dtable to add the plugin to (required, dtable must exist under this name)
  dtableName: process.env.REACT_APP_DTABLE_NAME,
  // default language ('en' or 'zh-cn' are common, see "src/locale/index.js" for all lang keys)
  lang: 'en'
};
