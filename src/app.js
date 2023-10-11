import React from "react";
import PropTypes from "prop-types";
// import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import DTable from "dtable-sdk";
import intl from "react-intl-universal";
import "./locale/index.js";
import Modal from "./components/Modal/index.js";

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
      this.dtable.subscribe("dtable-connect", () => {
        this.onDTableConnect();
      });
    } else {
      // integrated to dtable app
      this.dtable.initInBrowser(window.app.dtableStore);
    }

    this.getData();

    this.unsubscribeLocalDtableChanged = this.dtable.subscribe(
      "local-dtable-changed",
      () => {
        this.onDTableChanged();
      }
    );
    this.unsubscribeRemoteDtableChanged = this.dtable.subscribe(
      "remote-dtable-changed",
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

  getData = () => {
    let subtables = this.dtable.getTables();
    let linkedRows = this.dtable.getTableLinkRows(
      subtables[0].rows,
      subtables[0]
    );
    let allViews = this.dtable.getViews(subtables[0]);

    this.setState({
      subtables,
      linkedRows,
      allViews,
      currentView: allViews[0],
      currentTable: subtables[0],
    });
  };

  addNewView = (table, v_name) => {
    this.dtable.addView(table, v_name);
    let newView = this.dtable.getViewByName(table, v_name);

    newView && this.setState({ currentView: newView });
    console.log("done");
  };

  // onTableChange = () => {}

  render() {
    let { isLoading, showDialog } = this.state;
    if (isLoading) {
      return "";
    }

    const { subtables, linkedRows, allViews, currentTable, currentView } =
      this.state;

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
          />
        )}
      </div>
    );
  }
}

App.propTypes = propTypes;

export default App;
