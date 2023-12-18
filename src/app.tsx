/* eslint-disable jsx-a11y/iframe-has-title */
//@ts-nocheck
import React from 'react';
// internationalization
import intl from 'react-intl-universal';
import './locale';
import { PLUGIN_NAME } from './constants/index.ts';
import { VIEW_NAME } from './constants/setting-key.ts';
import styles from './styles/Modal.module.scss';
import { getParentRows } from './utils/helpers/tableRows.ts';
import deepCopy from 'deep-copy';
import { IAppProps, IAppState } from './utils/Interfaces/App.interface.ts';
import OrgChartHeader from './components/OrgChartHeader/index.tsx';
import Views from './components/Views/index.tsx';
import OrgChartSettings from './components/OrgChartSettings/index.tsx';


const DEFAULT_PLUGIN_SETTINGS = {
  views: [
    {
      _id: '0000',
      name: 'Default View',
      settings: { shown_column_names: [], all_columns: [] },
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
      showSettings: false,
      currentViewIdx: 0,
    };
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
      window.dtableSDK.subscribe('dtable-connect', () => {
        this.onDTableConnect();
      });
    }

    this.unsubscribeLocalDtableChanged = window.dtableSDK.subscribe(
      'local-dtable-changed',
      () => {
        this.onDTableChanged();
      }
    );
    this.unsubscribeRemoteDtableChanged = window.dtableSDK.subscribe(
      'remote-dtable-changed',
      () => {
        this.onDTableChanged();
      }
    );
    this.resetData();
  }

  onDTableConnect = () => {
    this.resetData();
  };

  onDTableChanged = () => {
    this.resetData();
  };

  getPluginSettings = () => {
    return window.dtableSDK.getPluginSettings(PLUGIN_NAME).views
      ? window.dtableSDK.getPluginSettings(PLUGIN_NAME)
      : DEFAULT_PLUGIN_SETTINGS;
  };

  onPluginToggle = () => {
    this.setState({ showDialog: false });
    window.app.onClosePlugin && window.app.onClosePlugin();
  };

  // get required data and set states
  resetData = () => {
    let table = window.dtableSDK.getActiveTable();
    let plugin_settings = this.getPluginSettings();
    let allViews = plugin_settings.views;
    let subtables = window.dtableSDK.getTables();
    let linkedRows = window.dtableSDK.getTableLinkRows(table.rows, table);
    let shownColumns = table.columns.filter((c: any) =>
      allViews[0]?.settings?.shown_column_names.includes(c.name)
    );
    let baseViews = window.dtableSDK.getViews(table);
    let currentBaseView;

    if (plugin_settings[VIEW_NAME]) {
      currentBaseView = baseViews.find(
        (v) => v.name === plugin_settings[VIEW_NAME]
      );
    } else {
      currentBaseView = baseViews[0];
    }

    if (!shownColumns[0]) {
      shownColumns = table.columns;
    }

    shownColumns.sort(
      (a, b) =>
        allViews[0]?.settings?.shown_column_names.indexOf(a.name) -
        allViews[0]?.settings?.shown_column_names.indexOf(b.name)
    );

    let _rows = getParentRows(linkedRows, table);

    this.setState({
      subtables,
      linkedRows,
      currentTable: table,
      shownColumns,
      baseViews,
      plugin_settings,
      currentBaseView,
      isLoading: false,
      allViews,
      _rows,
    });
  };

  // switch tables
  onTablechange = (table) => {
    const { subtables, allViews, currentViewIdx } = this.state;
    let currentTable = subtables.find((s) => s._id === table.value);
    let linkedRows = window.dtableSDK.getTableLinkRows(
      currentTable.rows,
      currentTable
    );
    let shownColumns = currentTable.columns.filter((c: any) =>
      allViews[currentViewIdx].settings.shown_column_names.includes(c.name)
    );
    shownColumns.sort(
      (a, b) =>
        allViews[currentViewIdx].settings.shown_column_names.indexOf(a.name) -
        allViews[currentViewIdx].settings.shown_column_names.indexOf(b.name)
    );

    let _rows = getParentRows(linkedRows, currentTable);

    this.setState({
      linkedRows,
      currentTable,
      _rows,
    });
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
    const { currentTable } = this.state;
    let shownColumns = currentTable.columns.filter((c: any) =>
      views[currentViewIdx]?.settings?.shown_column_names.includes(c.name)
    );

    shownColumns.sort(
      (a, b) =>
        views[currentViewIdx]?.settings?.shown_column_names.indexOf(a.name) -
        views[currentViewIdx]?.settings?.shown_column_names.indexOf(b.name)
    );

    this.setState(
      { currentViewIdx, allViews: views, plugin_settings, shownColumns },
      () => {
        this.updatePluginSettings(plugin_settings);
        callBack && callBack();
      }
    );
  };

  // update current base view
  updateBaseView = (pluginSettings) => {
    const { baseViews } = this.state;
    let currentBaseView = baseViews.find(
      (v) => v.name === pluginSettings[VIEW_NAME]
    );
    this.setState({ currentBaseView });
    this.updatePluginSettings(pluginSettings);
  };

  // update plugin settings
  updatePluginSettings = (pluginSettings: any) => {
    window.dtableSDK.updatePluginSettings(PLUGIN_NAME, pluginSettings);
  };

  // sort field functionality
  updateColumnFieldOrder = (shownColumns: any, _columns: any) => {
    let { currentViewIdx, plugin_settings } = this.state;
    const { allViews } = this.state;
    let newViews = deepCopy(allViews);
    let setting = { ...newViews[currentViewIdx].settings };

    this.setState({ shownColumns });

    newViews[currentViewIdx].settings = {
      ...setting,
      shown_column_names: shownColumns.map((c: any) => c.name),
      all_columns: _columns,
    };

    plugin_settings.views = newViews;

    this.updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // implementation to hide/show columns
  handleShownColumn = (val: string, checked: boolean) => {
    let { plugin_settings } = this.state;
    const { currentTable, allViews, currentViewIdx, shownColumns } = this.state;
    let newViews = deepCopy(allViews);
    let oldView = allViews[currentViewIdx];
    let newColumnNames: any[];

    if (!checked) {
      let column = currentTable.columns.find((c: any) => c.key === val);

      this.setState((prev) => ({
        shownColumns: [...prev.shownColumns, column],
      }));

      newColumnNames = [...shownColumns, column].map((c) => c.name);
    } else {
      this.setState((prev) => ({
        shownColumns: prev.shownColumns.filter((c) => c.key !== val),
      }));

      newColumnNames = shownColumns
        .filter((c) => c.key !== val)
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

  // toggle settings display
  toggleSettings = () => {
    this.setState((prev) => ({ showSettings: !prev.showSettings }));
  };

  render() {
    let { isLoading, showDialog } = this.state;
    if (isLoading || !showDialog) {
      return '';
    }

    const {
      subtables,
      allViews,
      currentTable,
      currentViewIdx,
      shownColumns,
      baseViews,
      currentBaseView,
      plugin_settings,
      showSettings,
    } = this.state;

    let columns = currentTable?.columns;

    return (
      <div>
        {showDialog && (
          <div className={styles.modal}>
            <iframe
              id="ifmcontentstoprint"
              style={{ height: '0px', width: '0px', position: 'absolute' }}
            ></iframe>
            {/* header  */}
            <OrgChartHeader
              toggleSettings={this.toggleSettings}
              showSettings={showSettings}
              toggle={this.onPluginToggle}
            />
            {/* main body  */}
            <div
              className="d-flex position-relative"
              style={{ height: '100%' }}
            >
              {/* views  */}
              <Views
                allViews={allViews}
                onSelectView={this.onSelectView}
                currentViewIdx={currentViewIdx}
                plugin_settings={plugin_settings}
                updateViews={this.updateViews}
              />

              {/* content  */}
              <div className={styles.body}>
                <div>{`'dtable-subtables: '${JSON.stringify(subtables)}`}</div>
              </div>

              {/* settings  */}
              {showSettings && (
                <OrgChartSettings
                  columns={columns}
                  toggleSettings={this.toggleSettings}
                  onTablechange={this.onTablechange}
                  subtables={subtables}
                  currentTable={currentTable}
                  shownColumns={shownColumns}
                  currentView={allViews[currentViewIdx]}
                  baseViews={baseViews}
                  currentBaseView={currentBaseView}
                  handleShownColumn={this.handleShownColumn}
                  updateColumnFieldOrder={this.updateColumnFieldOrder}
                  updateBaseView={this.updateBaseView}
                  plugin_settings={plugin_settings}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
