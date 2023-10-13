import React from 'react';
import PropTypes from 'prop-types';
import DTable from 'dtable-sdk';
// import intl from 'react-intl-universal';
import './locale/index.js';
import Modal from './components/Modal/index.js';
import { getParentRows } from './utils/helpers/tableRows.js';

const propTypes = {
  isDevelopment: PropTypes.bool,
  showDialog: PropTypes.bool,
  row: PropTypes.object, // If the plugin is opened with a button, it will have a row parameter
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      showDialog: props.showDialog || false,
      plugin_settings: {}
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
    this.resetData();
  }

  onDTableConnect = () => {
    this.resetData();
  };

  onDTableChanged = () => {
    this.resetData();
  };

  resetData = () => {
    this.setState({ isLoading: false });
  };

  onPluginToggle = () => {
    this.setState({ showDialog: false });
    window.app.onClosePlugin();
  };

  // get required data and set states 
  getData = () => {
    let subtables = this.dtable.getTables();
    let linkedRows = this.dtable.getTableLinkRows(
      subtables[0].rows,
      subtables[0]
    );
    let allViews = this.dtable.getViews(subtables[0]);
    let shownColumns = this.dtable.getViewShownColumns(
      allViews[0],
      subtables[0]
    );
    let _rows = getParentRows(linkedRows, subtables[0]);

    this.setState({
      subtables,
      linkedRows,
      allViews,
      currentView: allViews[0],
      currentTable: subtables[0],
      shownColumns,
      _rows,
    });
  };

  // switch tables 
  onTablechange = (id) => {
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

  // add new view 
  addNewView = (table, v_name) => {
    this.dtable.addView(table, v_name);
    let newView = this.dtable.getViewByName(table, v_name);

    newView && this.setState({ currentView: newView });
  };

  // temporary implementation to replicate hiding/showing columns 
 handleShownColumn = (e) => {
   e.persist();
   const { currentTable } = this.state;

   if(e.target.checked) {
     let column = currentTable.columns.find(c => c.key === e.target.value);
     this.setState(prev => ({shownColumns: [...prev.shownColumns, column]}));
   } else {
     this.setState(prev => ({shownColumns: prev.shownColumns.filter(c => c.key !== e.target.value)}));
   }
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
     currentView,
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
           togglePlugin={this.onPluginToggle}
           linkedRows={linkedRows}
           allViews={allViews}
           currentView={currentView}
           addNewView={this.addNewView}
           toggle={this.onPluginToggle}
           handleShownColumn={this.handleShownColumn}
           shownColumns={shownColumns}
           onTablechange={this.onTablechange}
           rows={_rows}
           columns={columns}
         />
       )}
     </div>
   );
 }
}

App.propTypes = propTypes;

export default App;
