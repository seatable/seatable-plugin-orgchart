import { CellType } from 'dtable-utils';
import pluginContext from '../plugin-context';
import { AppActiveState, IPluginDataStore } from './Interfaces/App.interface';
import { PresetSettings, PresetsArray } from './Interfaces/PluginPresets/Presets.interface';
import {
  IActiveTableAndView,
  Table,
  TableArray,
  TableColumn,
  TableRow,
  TableView,
} from './Interfaces/Table.interface';
import { DEFAULT_PLUGIN_DATA, PLUGIN_NAME, POSSIBLE, PresetHandleAction } from './constants';

export const generatorBase64Code = (keyLength = 4) => {
  let key = '';
  for (let i = 0; i < keyLength; i++) {
    key += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
  }
  return key;
};

export const generatorPresetId = (presets: Array<{ _id: string }>): string => {
  let preset_id: string = '',
    isUnique = false;

  const isIdUnique = (id: string): boolean => {
    return presets?.every((item) => {
      return item._id !== id;
    });
  };

  while (!isUnique) {
    preset_id = generatorBase64Code(4);
    isUnique = isIdUnique(preset_id);

    if (isUnique) {
      break;
    }
  }

  return preset_id;
};

export const generateImageSrc = (imageName: string, server: string, pluginName: string, isDevelopment: boolean | undefined): string => {
  if (isDevelopment || !server) {
    return `./media/image/${imageName}`;
  }
  return `${server}/dtable-plugins/${pluginName}/?path=/media/image/${imageName}`;
};

export const getImageThumbnailUrl = (url: string, size?: number): string => {
  const server = pluginContext.getSetting('server');
  let isInternalLink = url.indexOf(server) > -1;
  if (isInternalLink) {
    size = size || 256;
    let imageThumbnailUrl = url.replace('/workspace', '/thumbnail/workspace') + '?size=' + size;
    return imageThumbnailUrl;
  }
  return url;
};

export const isValidEmail = (email: string): boolean => {
  const reg = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,6}$/;

  return reg.test(email);
};

export const calculateColumns = (
  galleryColumnsName: string[],
  currentColumns: { name: string }[]
): { name: string }[] => {
  let newColumns: { name: string }[] = [];
  galleryColumnsName.forEach((columnName) => {
    let column = currentColumns.find((column) => columnName === column.name);
    if (column) {
      newColumns.push(column);
    }
  });
  return newColumns;
};

export const calculateColumnsName = (
  currentColumns: { name: string }[],
  galleryColumnsName: string[] | undefined
): string[] => {
  let newColumnsName: string[] = [];
  currentColumns.forEach((column) => {
    newColumnsName.push(column.name);
  });
  if (galleryColumnsName) {
    let columnsName: string[] = Array.from(new Set([...galleryColumnsName, ...newColumnsName]));
    newColumnsName = columnsName.filter((columnName) =>
      newColumnsName.some((c) => c === columnName)
    );
  }
  return newColumnsName;
};

export const checkDesktop = () => {
  return window.innerWidth >= 768;
};

export const isTableEditable = (
  {
    permission_type = 'default',
    permitted_users = [],
  }: { permission_type?: string; permitted_users?: string[] },
  TABLE_PERMISSION_TYPE: {
    DEFAULT: string;
    ADMINS: string;
    SPECIFIC_USERS: string;
  }
): boolean => {
  const { isAdmin, username } = window.dtable ? window.dtable : window.dtablePluginConfig;

  if (!permission_type) {
    return true;
  }
  if (permission_type === TABLE_PERMISSION_TYPE.DEFAULT) {
    return true;
  }
  if (permission_type === TABLE_PERMISSION_TYPE.ADMINS && isAdmin) {
    return true;
  }
  if (
    permission_type === TABLE_PERMISSION_TYPE.SPECIFIC_USERS &&
    permitted_users.includes(username)
  ) {
    return true;
  }
  return false;
};

export const getTitleColumns = (columns?: TableColumn[]) => {
  const SHOW_TITLE_COLUMN_TYPE = [
    CellType.TEXT,
    CellType.SINGLE_SELECT,
    CellType.MULTIPLE_SELECT,
    CellType.NUMBER,
    CellType.FORMULA,
    CellType.DATE,
    CellType.COLLABORATOR,
    CellType.GEOLOCATION,
    CellType.CTIME,
    CellType.MTIME,
    CellType.CREATOR,
    CellType.LAST_MODIFIER,
  ];
  return (
    columns?.filter((column) => SHOW_TITLE_COLUMN_TYPE.find((type) => type === column.type)) || []
  );
};

export const canCreateRows = (
  table: { table_permissions?: { add_rows_permission?: any } },
  TABLE_PERMISSION_TYPE: {
    DEFAULT: string;
    ADMINS: string;
    SPECIFIC_USERS: string;
  }
): boolean => {
  let canCreateRows = true;
  if (table && table.table_permissions && table.table_permissions.add_rows_permission) {
    canCreateRows = isTableEditable(
      table.table_permissions.add_rows_permission,
      TABLE_PERMISSION_TYPE
    );
  }
  return canCreateRows;
};

export const needUseThumbnailImage = (url: string): string | boolean => {
  if (!url || url.lastIndexOf('.') === -1) {
    return false;
  }
  const image_suffix = url.substr(url.lastIndexOf('.') + 1).toLowerCase();
  const suffix = ['bmp', 'tif', 'tiff'];
  return suffix.includes(image_suffix);
};

export const isInternalImg = (url: string): boolean | undefined => {
  if (!url) return;
  return url.indexOf(window.dtable.server) > -1;
};

export const checkSVGImage = (url: string): boolean | undefined => {
  if (!url) return false;
  return url.substr(-4).toLowerCase() === '.svg';
};

export const truncateTableName = (tableName: string) => {
  let _tableName;

  if (tableName.split('').length > 22) {
    _tableName = tableName.slice(0, 20) + '...';

    return _tableName;
  }

  return tableName;
};

/**
 * Checks whether a preset name already exists in the presets array, excluding the current index.
 *
 * @param {string} presetName - The name of the preset to check for existence.
 * @param {PresetsArray} presets - An array of presets to search for duplicates.
 * @param {number} currentIndex - The index of the preset to exclude from the check.
 * @returns {boolean} - Returns true if the preset name already exists, excluding the current index.
 */
export const isUniquePresetName = (
  presetName: string,
  presets: PresetsArray,
  currentIndex: number
): boolean => {
  // Using the `some` method to check if any preset (excluding the current index) has the same name
  return presets.some((preset, index) => index !== currentIndex && preset.name === presetName);
};

export const appendPresetSuffix = (name: string, nameList: string[], suffix: string): string => {
  if (!nameList.includes(name.trim())) {
    return name;
  } else {
    let _name = `${name} ${suffix}`;
    return appendPresetSuffix(_name, nameList, suffix);
  }
};

/**
 * The function has the purpose of getting the plugin data
 * If the plugin presets are not found, it maps inside the activeTable and returns set it as value.
 * @param {string} PLUGIN_NAME The name of the plugin.
 * @param {Table} activeTable A Table object needed in the .
 * @returns An array with the plugin's presets
 */
// export const getPluginSettings = (activeTable: Table) => {
// Function implementation...
// };
export const getPluginDataStore = (activeTable: Table, PLUGIN_NAME: string) => {
  // Retrieving the Plugin Data as the IPluginDataStore
  const getPluginDataStore: IPluginDataStore = window.dtableSDK.getPluginSettings(PLUGIN_NAME); // getPluginSettings = getPluginDataStore

  return getPluginDataStore === null || getPluginDataStore.presets.length === 0
    ? createDefaultPluginDataStore(activeTable, PLUGIN_NAME)
    : getPluginDataStore;
};

/**
 * Parses plugin data to create the active state for the application.
 *
 * @param {IPluginDataStore} pluginDataStore - The data store containing plugin-related information.
 * @param {PresetsArray} pluginPresets - An array of presets used by the plugin.
 * @param {TableArray} allTables - An array containing all available tables in the application.
 */
export const parsePluginDataToActiveState = (
  pluginDataStore: IPluginDataStore,
  pluginPresets: PresetsArray,
  allTables: TableArray
) => {
  // Extract relevant data from the pluginDataStore and allTables arrays
  let idx = pluginDataStore.activePresetIdx;
  let id = pluginDataStore.activePresetId;
  let table =
    allTables.find((t) => t._id === pluginPresets[idx].settings?.selectedTable?.value) ||
    allTables[0];
  let tableName = table.name;
  let tableView = table.views.find(
    (v) => v._id === pluginPresets[idx].settings?.selectedView?.value
  )!;
  let title = pluginPresets[idx].settings?.title || getTitleColumns(table.columns)[0];
  let relationship = pluginPresets[idx].settings?.relationship || getDefaultLinkColumn(table);
  let coverImg = pluginPresets[idx].settings?.coverImg;

  // Create the appActiveState object with the extracted data
  const appActiveState = {
    activePresetId: id,
    activePresetIdx: idx,
    activeTable: table,
    activeTableName: tableName,
    activeTableView: tableView,
    activeCardTitle: title,
    activeRelationship: relationship,
    activeCoverImg: coverImg,
  };

  // Return the active state object
  return appActiveState;
};

/**
 * Safeguard function to determine the active state, considering the presence of presets.
 * If no presets are available, the first Table and View are set as the active ones.
 *
 * @param {PresetsArray} pluginPresets - An array of presets used by the plugin.
 * @param {Table} activeTable - The currently active table in the application.
 * @param {object} activeTableAndView - The active table and view as an object containing {table: Table, view: TableView}.
 * @param {TableRow[]} activeViewRows - An array of rows for the active view.
 */
export const getActiveStateSafeGuard = (
  pluginPresets: PresetsArray,
  activeTable: Table,
  activeTableAndView: {
    table: Table;
    view: TableView;
  },
  activeViewRows: TableRow[]
) => {
  // Create the checkForPresets object with the active state based on presets or default values
  const checkForPresets: AppActiveState = {
    activeTable: (pluginPresets[0] && (activeTableAndView?.table as Table)) || activeTable,
    activeTableName:
      (pluginPresets[0] && pluginPresets[0].settings?.selectedTable?.label) || activeTable.name,
    activeTableView:
      (pluginPresets[0] && (activeTableAndView?.view as TableView)) || activeTable.views[0],
    activePresetId: (pluginPresets[0] && pluginPresets[0]._id) || '0000', // '0000' as Safe guard if there are no presets
    activePresetIdx: 0,
    activeViewRows: activeViewRows,
    activeCardTitle: getTitleColumns(activeTableAndView.table.columns)[0],
    activeRelationship: getDefaultLinkColumn(activeTableAndView?.table),
  };

  // Return the active state object considering presets or default values
  return checkForPresets;
};

/**
 * Retrieves the active table and view based on the preset handling action type.
 *
 * @param pluginPresets - Array of plugin presets.
 * @param allTables - Array of all available tables.
 * @param type - Type of preset handling action (e.g., new, duplicate).
 * @param option - Additional options for handling presets (e.g., preset ID, preset settings).
 * @returns An object containing the active table and view.
 */
export const getActiveTableAndActiveView = (
  pluginPresets: PresetsArray,
  allTables: TableArray,
  type?: string,
  option?: { pId: string; pSettings: PresetSettings }
) => {
  let tableViewObj;
  let table;
  let views;
  let view;

  // Type === 'new' we set the first Table and View as the active ones
  // Type === 'duplicate' we set the selected Table and View as the active ones
  // Type === undefined we set the last used Table and View as the active ones (TO-DO)
  if (type === PresetHandleAction.new) {
    table = allTables[0];
    view = table?.views[0];
  } else if (type === PresetHandleAction.duplicate) {
    table = allTables.find((i) => i.name === option?.pSettings.selectedTable?.label)!;
    views = table?.views;
    view = views?.find((v) => {
      return v.name === option?.pSettings.selectedView?.label;
    })!;
  } else if (pluginPresets.length > 0 && type === undefined) {
    // This needs to be changes since in this case we need to retrieve the Last Preset used from the USER
    table = allTables.find((i) => i.name === pluginPresets[0].settings?.selectedTable?.label)!;
    views = table?.views;
    view = views?.find((v) => {
      return v.name === pluginPresets[0].settings?.selectedView?.label;
    })!;
  }

  return (tableViewObj = {
    table: table,
    view: view,
  } as IActiveTableAndView);
};

/**
 * Creates a default preset for the plugin.
 * @param activeTable - The active table for which it retrieves the info.
 * @param pluginName - The name of the plugin associated with the preset.
 * @returns The default preset with initial settings.
 */
export const createDefaultPluginDataStore = (
  activeTable: Table,
  pluginName: string
): IPluginDataStore => {
  // This is a safe guard to prevent the plugin from crashing if there are no presets
  const _presetSettings: PresetSettings = {
    selectedTable: { value: activeTable._id, label: activeTable.name },
    selectedView: { value: activeTable.views[0]._id, label: activeTable.views[0].name },
    title: getTitleColumns(activeTable.columns)[0],
    relationship: getDefaultLinkColumn(activeTable),
  };

  // Importing the default settings from the constants file and updating the presets array with the Default Settings
  const updatedDefaultDataStore = {
    ...DEFAULT_PLUGIN_DATA,
    [PLUGIN_NAME]: pluginName,
    presets: [
      {
        ...DEFAULT_PLUGIN_DATA.presets[0],
        settings: _presetSettings,
      },
    ],
  };
  window.dtableSDK.updatePluginSettings(pluginName, updatedDefaultDataStore);
  return updatedDefaultDataStore;
};

/**
 * Creates default preset settings based on the provided array of tables.
 *
 * @param {TableArray} allTables - An array containing all available tables in the application.
 * @returns {object} defaultPresetSettings - Default settings for a preset.
 */
export const createDefaultPresetSettings = (allTables: TableArray) => {
  // Extract information for the default table and view
  const tableInfo = { value: allTables[0]._id, label: allTables[0].name };
  const viewInfo = { value: allTables[0].views[0]._id, label: allTables[0].views[0].name };

  // Create and return the default preset settings object
  return {
    shown_image_name: 'Image',
    shown_title_name: 'Title',
    selectedTable: tableInfo,
    selectedView: viewInfo,
    title: getTitleColumns(allTables[0].columns)[0],
    relationship: getDefaultLinkColumn(allTables[0]),
    show_field_names: true,
  };
};

export const findPresetName = (presets: PresetsArray, presetId: string) => {
  return presets.find((preset) => preset._id === presetId)?.name;
};

export const isMobile = () => {
  return window.innerWidth <= 800;
};

export const getDefaultLinkColumn = (table: Table) => {
  return table.columns.filter((c: TableColumn) => c.type === 'link')[0];
};

export const getImageColumns = (columns?: TableColumn[]) => {
  return columns?.filter((c) => c.type === 'image') || [];
};

export const isAllColumnsShown = (shownColumns?: string[], columns?: TableColumn[]) => {
  if (columns) {
    for (let i = 0; i < columns.length; i++) {
      if (!shownColumns?.includes(columns[i].key)) {
        return false;
      }
    }

    return true;
  }
};

export const showFieldNames = (settings: PresetSettings) => {
  if (
    !Object.prototype.hasOwnProperty.call(settings, 'show_field_names') ||
    settings.show_field_names
  ) {
    return true;
  } else {
    return false;
  }
};






// CUSTOM FUNCTIONS

export const parseRowsData = (table: Table | null, rows: any, relationship?: TableColumn) => {
  let parentId: any;
  let linkedRows = window.dtableSDK.getTableLinkRows(rows, table);
  let _rows = [];


  if (Object.keys(linkedRows).length > 0) {
    _rows = rows.map((r: any) => {
      parentId = linkedRows[r._id][relationship?.key!][0];

      return {
        ...r,
        id: r._id,
        parentId,
      };
    })!;
  }


  return filterMultipleParentNodes(_rows);
};

// Function to filter out multiple parent nodes to one primary parent node
const filterMultipleParentNodes = (rows: TableRow[]) => {
  let parentNode;
  let parentNodes = rows.filter((row) => !row.parentId);
  let childNodes = rows.filter((row) => row.parentId);
  let __rows = [...rows];


  // if no parents and no child, return an empty array
  if ((parentNodes.length === 0 && childNodes.length === 0)) {
    return [];
  }

  // if no child, return one parent node
  if (childNodes.length === 0) {
    return [parentNodes[0]];
  }

  parentNodes = parentNodes.filter((parent) => childNodes.some((child) => child.parentId === parent.id));

  // if no parent has children, remove all parent nodes, leaving only childNodes
  if (parentNodes.length === 0) {
    __rows = childNodes;
  }

  // assign rows to parentNodes if no parent nodes are found
  if (parentNodes.length === 0 && childNodes.length === __rows.length) {
    parentNodes = __rows;
  }

  parentNodes = parentNodes.map((parent) => { return ({ ...parent, children: getAllChildNodes(parent, childNodes) }); });

  // get parent node with the most children
  parentNode = parentNodes.sort((a, b) => (b.children as any[]).length - (a.children as any[]).length)[0];

  // set childNodes to the children of parent node
  childNodes = parentNode?.children as TableRow[];

  // delete children property (not needed anymore)
  if (parentNode) delete parentNode.children;

  // create new array that includes one parentNode and all its children
  const finalData = [{ ...parentNode, parentId: null }, ...childNodes];

  return parentNode ? finalData : [];
};

/**  Function to get every single node in a parents subtree
   Example
        3
       / \
      4   6
     / \
    5   7
If parent is 3, function will return [4, 6, 5, 7]
If parent is 4, function will return [5, 7]
**/
const getAllChildNodes = (parentNode: TableRow, childNodes: any[]): any => {
  const _children = childNodes.filter((child) => child.parentId === parentNode.id);

  if (_children.length === 0) {
    return _children;
  } else {

    return [..._children, ...[].concat(..._children.map((child) => {
      return getAllChildNodes(child, childNodes);
    }))];
  };
};

export const checkIfLinkToDifferentTable = (link: TableColumn, table: Table) => {
  const links = window.dtableSDK.getLinks();
  const _link = links.find((l: any) => l._id === link.data.link_id);

  if (_link?.table1_table2_map || (_link?.table1_table2_map && Object.keys(_link?.table1_table2_map).length > 0)) {
    return true;
  } else {
    return false;
  }
};

export const removeDeletedFields = (fields: TableColumn[], table: Table) => {
  return fields.filter((field: TableColumn) => table.columns.map((column) => column.key).includes(field.key));
};

export const arraysEqual = (arr1: any, arr2: any) => {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
};

export const formatOrgChartTreeData = (persistedData: any[], cardData: any[]) => {
  let DATA = persistedData?.length === cardData?.length ? persistedData?.map((d) => {
    let p_d = cardData?.find((p) => p.id === d.id);
    return p_d ? { ...p_d, _expanded: d._expanded } : d;
  }) : cardData;

  return DATA;
};

export const formatOrgChartShownColumns = (pluginPresets:PresetsArray , appActiveState: AppActiveState, shownColumns: (TableColumn | undefined)[] | undefined) => {
  let cols = pluginPresets[appActiveState.activePresetIdx].settings?.columns || [];
  let extracols =
    appActiveState.activeTable?.columns.filter(
      (c) => !cols?.map((col) => col?.key).includes(c?.key)
    ) || [];
  let fields = [...cols, ...extracols] || appActiveState.activeTable?.columns;
  let fieldsIDs = fields?.map((f) => f?.key);
  let _shownColumns = fieldsIDs
    ?.map((id) => shownColumns?.find((c) => c?.key === id))
    .filter((c) => c !== undefined);

  return _shownColumns;
};