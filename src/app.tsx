//@ts-nocheck
import React from 'react';
import DTable from 'dtable-sdk';
import intl from 'react-intl-universal';
import { generatorViewId } from './utils/utils.ts';
import { PLUGIN_NAME, SETTING_KEY } from './constants/index.ts';
import View from './model/view.ts';
import './locale/index.js';
import Modal from './components/Modal/index.tsx';
import { getParentRows } from './utils/helpers/tableRows.ts';
import deepCopy from 'deep-copy';

import { IAppProps, IAppState } from './utils/Interfaces/App.interface.ts';
import pluginContext from './plugin-context.ts';

const DEFAULT_PLUGIN_SETTINGS = {
  views: [
    {
      _id: '0000',
      name: intl.get('Default_View'),
      settings: { shown_column_names: {}, all_columns: [] },
    },
  ],
};

class App extends React.Component<IAppProps, IAppState> {
  dtable: any;
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      isLoading: true,
      showDialog: props.showDialog || false,
      plugin_settings: { views: [] },
      currentViewIdx: 0,
    };
    this.dtable = new DTable();
  }

  componentDidMount() {
    this.initPluginDTableData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ showDialog: nextProps.showDialog });
  }

  componentWillUnmount() {
    this.unsubscribeLocalDtableChanged();
    this.unsubscribeRemoteDtableChanged();
  }
  unsubscribeLocalDtableChanged() {
    throw new Error('Method not implemented.');
  }
  unsubscribeRemoteDtableChanged() {
    throw new Error('Method not implemented.');
  }

  async initPluginDTableData() {
    const { isDevelopment } = this.props;
    if (isDevelopment) {
      // local develop
      await this.dtable.init(window.dtablePluginConfig);
      await this.dtable.syncWithServer();
      this.dtable.subscribe('dtable-connect', () => {
        this.onDTableConnect();
      });
    } else {
      // integrated to dtable app
      this.dtable.initInBrowser(window.app.dtableStore);
    }

    this.getData();

    this.unsubscribeLocalDtableChanged = this.dtable.subscribe(
      'local-dtable-changed',
      () => {
        this.onDTableChanged();
      }
    );
    this.unsubscribeRemoteDtableChanged = this.dtable.subscribe(
      'remote-dtable-changed',
      () => {
        this.onDTableChanged();
      }
    );
  }

  onDTableConnect = () => {
    this.resetData();
  };

  onDTableChanged = () => {
    this.resetData();
  };

  resetData = () => {
    const views = this.getPluginSettings();
    let { currentViewIdx } = this.state;
    if (!views[currentViewIdx]) {
      currentViewIdx = views.length - 1;
    }

    this.setState({
      isLoading: false,
      currentViewIdx,
      allViews: views,
    });
  };

  getPluginSettings = () => {
    return (
      this.dtable.getPluginSettings(PLUGIN_NAME) || DEFAULT_PLUGIN_SETTINGS
    );
  };

  onPluginToggle = () => {
    this.setState({ showDialog: false });
    window.app.onClosePlugin();
  };

  // get required data and set states
  getData = () => {
    let table = this.dtable.getActiveTable();
    const allViews = this.getPluginSettings();
    let subtables = this.dtable.getTables();
    let linkedRows = this.dtable.getTableLinkRows(table.rows, table);
    let shownColumns = table.columns.filter((c: any) =>
      allViews[0].settings.shown_column_names.includes(c.name)
    );

    shownColumns.sort(
      (a, b) =>
        allViews[0].settings.shown_column_names.indexOf(a.name) -
        allViews[0].settings.shown_column_names.indexOf(b.name)
    );


    let _rows = getParentRows(linkedRows, table);

    this.setState({
      subtables,
      linkedRows,
      currentTable: table,
      shownColumns,
      _rows,
    });
  };

  // switch tables
  onTablechange = (id: string) => {
    const { subtables } = this.state;
    let currentTable = subtables.find((s) => s._id === id);
    let linkedRows = this.dtable.getTableLinkRows(
      currentTable.rows,
      currentTable
    );
    let allViews = this.dtable.getViews(currentTable);
    let shownColumns = currentTable.columns.filter((c: any) =>
      allViews[0].settings.shown_column_names.includes(c.name)
    );
    shownColumns.sort(
      (a, b) =>
        allViews[0].settings.shown_column_names.indexOf(a.name) -
        allViews[0].settings.shown_column_names.indexOf(b.name)
    );

    let _rows = getParentRows(linkedRows, currentTable);

    this.setState({
      linkedRows,
      currentTable,
      allViews,
      currentView: allViews[0],
      shownColumns,
      _rows,
    });
  };

  getSelectedTable = (tables: any, settings = {}) => {
    let selectedTable = this.dtable.getTableByName(
      settings[SETTING_KEY.TABLE_NAME]
    );
    if (!selectedTable) {
      return tables[0];
    }
    return selectedTable;
  };

  initOrgChartSetting = (settings = {}) => {
    let initUpdated = {};
    let tables = this.dtable.getTables();
    let selectedTable = this.getSelectedTable(tables, settings);
    let titleColumn = selectedTable.columns.find(
      (column: any) => column.key === '0000'
    );
    let imageColumn = selectedTable.columns.find(
      (column: any) => column.type === 'image'
    );
    let imageName = imageColumn ? imageColumn.name : null;
    let titleName = titleColumn ? titleColumn.name : null;
    initUpdated = Object.assign(
      {},
      { shown_image_name: imageName },
      { shown_title_name: titleName },
      { shown_column_names: selectedTable.columns.map((c: any) => c.name) },
      { all_columns: selectedTable.columns }
    );
    return initUpdated;
  };

  // add new view
  addView = (viewName: string) => {
    let { allViews, plugin_settings } = this.state;
    let currentViewIdx = allViews.length;
    let _id: string = generatorViewId(allViews) || '';
    let newView = new View({ _id, name: viewName });
    let newViews = deepCopy(allViews);
    newViews.push(newView);

    let initUpdated = this.initOrgChartSetting();
    newViews[currentViewIdx].settings = Object.assign({}, initUpdated);
    plugin_settings.views = newViews;

    this.updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // edit view name
  editView = (viewName: string) => {
    let { currentViewIdx, plugin_settings } = this.state;
    const { allViews } = this.state;
    let newViews = deepCopy(allViews);
    let oldView = allViews[currentViewIdx];
    let _id: string = generatorViewId(allViews) || '';
    let updatedView = new View({ ...oldView, _id, name: viewName });

    newViews.splice(currentViewIdx, 1, updatedView);
    plugin_settings.views = newViews;

    this.updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // delete view
  deleteView = () => {
    let { currentViewIdx, plugin_settings } = this.state;
    const { allViews } = this.state;
    let newViews = deepCopy(allViews);
    newViews.splice(currentViewIdx, 1);
    if (currentViewIdx >= newViews.length) {
      currentViewIdx = newViews.length - 1;
    }
    plugin_settings.views = newViews;

    this.updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // Change view
  onSelectView = (viewId: string) => {
    const { allViews, currentTable } = this.state;
    let viewIdx = allViews.findIndex((view) => view._id === viewId);
    let shownColumns = currentTable.columns.filter((c: any) =>
      allViews[viewIdx].settings.shown_column_names.includes(c.name)
    );

    shownColumns.sort(
      (a, b) =>
        allViews[viewIdx].settings.shown_column_names.indexOf(a.name) -
        allViews[viewIdx].settings.shown_column_names.indexOf(b.name)
    );

    if (viewIdx > -1) {
      this.setState({ currentViewIdx: viewIdx, shownColumns });
    }
  };

  // Update views data
  updateViews = (
    currentViewIdx: number,
    views: any[],
    plugin_settings: any,
    callBack: any = null
  ) => {
    this.setState({ currentViewIdx, allViews: views, plugin_settings }, () => {
      this.updatePluginSettings(views);
      callBack && callBack();
    });
  };

  // update plugin settings
  updatePluginSettings = (pluginSettings: any) => {
    this.dtable.updatePluginSettings(PLUGIN_NAME, pluginSettings);
  };

  // sort field functionality
  updateColumnFieldOrder = (shownColumns: any, _columns: any) => {
    let { currentViewIdx, plugin_settings } = this.state;
    const { allViews } = this.state;
    let newViews = deepCopy(allViews);
    let setting = {...newViews[currentViewIdx].settings};

    this.setState({ shownColumns });

    newViews[currentViewIdx].settings = {
      ...setting,
      shown_column_names: shownColumns.map((c: any) => c.name),
      all_columns: _columns
    };

    plugin_settings.views = newViews;

    this.updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // implementation to hide/show columns
  handleShownColumn = (e: React.FormEvent<HTMLInputElement>) => {
    e.persist();
    let { plugin_settings } = this.state;
    const { currentTable, allViews, currentViewIdx, shownColumns } = this.state;
    let newViews = deepCopy(allViews);
    let oldView = allViews[currentViewIdx];
    let newColumnNames: any[];

    if (e.target.checked) {
      let column = currentTable.columns.find(
        (c: any) => c.key === e.target?.value
      );

      this.setState((prev) => ({
        shownColumns: [...prev.shownColumns, column],
      }));

      newColumnNames = [...shownColumns, column].map((c) => c.name);
    } else {
      this.setState((prev) => ({
        shownColumns: prev.shownColumns.filter(
          (c) => c.key !== e.target?.value
        ),
      }));

      newColumnNames = shownColumns
        .filter((c) => c.key !== e.target.value)
        .map((c) => c.name);
    }

    let updatedView = {
      ...oldView,
      settings: { ...oldView.settings, shown_column_names: newColumnNames },
    };

    newViews.splice(currentViewIdx, 1, updatedView);
    plugin_settings.views = newViews;

    this.updateViews(currentViewIdx, newViews, plugin_settings);
  };

  getSelectedViewIds = (key: string) => {
    let selectedViewIds = window.localStorage.getItem(key);
    return selectedViewIds ? JSON.parse(selectedViewIds) : {};
  };

  // functions for add row functionality
  onAddOrgChartItem = (view, table, rowID: string) => {
    let rowData = this.getInsertedRowInitData(view, table, rowID);
    this.onInsertRow(table, view, rowData);
  }

  getInsertedRowInitData = (view, table, rowID: string) => {
    return this.dtable.getInsertedRowInitData(view, table, rowID);
  }

  onInsertRow = (table, view, rowData) => {
    let columns = this.dtable.getColumns(table);
    let newRowData = {};
    for (let key in rowData) {
      let column = columns.find(column => column.key === key);
      if (!column) {
        continue;
      }
      switch(column.type) {
        case 'single-select': {
          let singleSelectName = '';
          singleSelectName = column.data.options.find(item => item.id === rowData[key]);
          newRowData[column.name] = singleSelectName.name;
          break;
        }
        case 'multiple-select': {
          let multipleSelectNameList = [];
          rowData[key].forEach(multiItemId => {
            let multiSelectItemName = column.data.options.find(multiItem => multiItem.id === multiItemId);
            if (multiSelectItemName) {
              multipleSelectNameList.push(multiSelectItemName.name);
            }
          });
          newRowData[column.name] = multipleSelectNameList;

          break;
        }
        default:
          newRowData[column.name] = rowData[key];
      }
    }
    let row_data = Object.assign({}, newRowData);

    this.dtable.appendRow(table, row_data, view);
    let viewRows = this.dtable.getViewRows(view, table);
    let insertedRow = viewRows[viewRows.length - 1];
    if (insertedRow) {
      pluginContext.expandRow(insertedRow, table);
    }
  }

  getTablePermissionType = () => {
    return  this.dtable.getTablePermissionType();
  }

  render() {
    let { isLoading, showDialog } = this.state;
    if (isLoading) {
      return '';
    }

    const {
      subtables,
      linkedRows,
      allViews,
      currentTable,
      currentViewIdx,
      shownColumns,
      _rows,
    } = this.state;

    let columns = currentTable.columns;

    return (
      <div>
        {showDialog && (
          <Modal
            subtables={subtables}
            currentTable={currentTable}
            linkedRows={linkedRows}
            allViews={allViews}
            currentViewIdx={currentViewIdx}
            addNewView={this.addView}
            toggle={this.onPluginToggle}
            handleShownColumn={this.handleShownColumn}
            shownColumns={shownColumns}
            onTablechange={this.onTablechange}
            onSelectView={this.onSelectView}
            deleteView={this.deleteView}
            editView={this.editView}
            updateColumnFieldOrder={this.updateColumnFieldOrder}
            onAddOrgChartItem={this.onAddOrgChartItem}
            getTablePermissionType={this.getTablePermissionType}
            rows={_rows}
            columns={columns}
          />
        )}
      </div>
    );
  }
}

export default App;
