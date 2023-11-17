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


const DEFAULT_PLUGIN_SETTINGS = {
  views: [
    {
      _id: '0000',
      name: intl.get('Default_View'),
      settings: {}
    }
  ]
};

class App extends React.Component<IAppProps, IAppState> {
  dtable: any;
  constructor(props: IAppProps) {
    super(props);
    this.state = {
      isLoading: true,
      showDialog: props.showDialog || false,
      plugin_settings: {views: []},
      currentViewIdx: 0
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
      allViews: views
    });
  };

  getPluginSettings = () => {
    return this.dtable.getPluginSettings(PLUGIN_NAME) || DEFAULT_PLUGIN_SETTINGS;
  }

  onPluginToggle = () => {
    this.setState({ showDialog: false });
    window.app.onClosePlugin();
  };

  // get required data and set states
  getData = () => {
    let table = this.dtable.getActiveTable();
    let allViews = this.dtable.getViews(table);

    let subtables = this.dtable.getTables();
    let linkedRows = this.dtable.getTableLinkRows(
      table.rows,
      table
    );
    let shownColumns = this.dtable.getViewShownColumns(
      allViews[0],
      table
    );
    let _rows = getParentRows(linkedRows, table);


    this.setState({
      subtables,
      linkedRows,
      currentTable: table,
      shownColumns,
      _rows
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
    let shownColumns = this.dtable.getViewShownColumns(
      allViews[0],
      currentTable
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
    let selectedTable = this.dtable.getTableByName(settings[SETTING_KEY.TABLE_NAME]);
    if (!selectedTable) {
      return tables[0];
    }
    return selectedTable;
  }


  initOrgChartSetting = (settings = {}) => {
    let initUpdated = {};
    let tables = this.dtable.getTables();
    let selectedTable = this.getSelectedTable(tables, settings);
    let titleColumn = selectedTable.columns.find((column: any) => column.key === '0000');
    let imageColumn = selectedTable.columns.find((column: any) => column.type === 'image');
    let imageName = imageColumn ? imageColumn.name : null;
    let titleName = titleColumn ? titleColumn.name : null;
    initUpdated = Object.assign({}, {shown_image_name: imageName}, {shown_title_name: titleName});
    return initUpdated;
  }

  // add new view
  addView = (viewName: string) => {
    let { allViews, plugin_settings} = this.state;
    let currentViewIdx = allViews.length;
    let _id: string = generatorViewId(allViews) || '';
    let newView = new View({ _id, name: viewName });
    let newViews = deepCopy(allViews);
    newViews.push(newView);

    let initUpdated = this.initOrgChartSetting();
    newViews[currentViewIdx].settings  = Object.assign({}, initUpdated);
    plugin_settings.views = newViews;
    
    this.updateViews(currentViewIdx, newViews, plugin_settings);
  }

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
  }

  onSelectView = (viewId: string) => {
    const { allViews, currentTable } = this.state;
    let viewIdx = allViews.findIndex(view => view._id === viewId);
    let shownColumns = this.dtable.getViewShownColumns(
      allViews[viewIdx],
      currentTable
    );

    if (viewIdx > -1) {
      this.setState({ currentViewIdx: viewIdx, shownColumns });
    }
  }

  updateViews = (currentViewIdx: number, views: any[], plugin_settings: any, callBack: any = null) => {
    this.setState({ currentViewIdx, allViews: views, plugin_settings}, () => {
      this.updatePluginSettings(views);
      callBack && callBack();
    });
  }

  updatePluginSettings = (pluginSettings: any) => {
    this.dtable.updatePluginSettings(PLUGIN_NAME, pluginSettings);
  }

  // temporary implementation to replicate hiding/showing columns
  handleShownColumn = (e: React.FormEvent<HTMLInputElement>) => {
    e.persist();
    const { currentTable } = this.state;

    if (e.currentTarget.checked) {
      let column = currentTable.columns.find(
        (c: any) => c.key === e.currentTarget.value
      );
      this.setState((prev) => ({
        shownColumns: [...prev.shownColumns, column],
      }));
    } else {
      this.setState((prev) => ({
        shownColumns: prev.shownColumns.filter(
          (c) => c.key !== e.currentTarget.value
        ),
      }));
    }
  };


  getSelectedViewIds = (key: string) => {
    let selectedViewIds = window.localStorage.getItem(key);
    return selectedViewIds ? JSON.parse(selectedViewIds) : {};
  };

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
            rows={_rows}
            columns={columns}
          />
        )}
      </div>
    );
  }
}

export default App;
