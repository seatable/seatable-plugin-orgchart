/**
 * local development settings
 */
export default {
  // dtable api token (required)
  APIToken: 'd3f019a6b71490ff8ac497378982942210b8b86f',
  // server URL of the dtable of the plugin (required)
  server: 'https://stage.seatable.io',
  // id of the workspace with the dtable of the plugin (required, workspace must exist)
  workspaceID: '314',
  // name of the dtable to add the plugin to (required, dtable must exist under this name)
  dtableName: 'Org Chart',
  // default language ('en' or 'zh-cn' are common, see "src/locale/index.js" for all lang keys)
  lang: 'en'
};
