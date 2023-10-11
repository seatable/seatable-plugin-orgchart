import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "../../styles/Modal.module.scss";
import DTable from "dtable-sdk";
import OrgCard from "../OrgCard";
import "../../assets/css/plugin-layout.css";
import NewViewPopUp from "../NewViewPopUp";
import { AiOutlinePlus } from "react-icons/ai";
import { BiSolidCog } from "react-icons/bi";
import { CgClose } from "react-icons/cg";

const propTypes = {
  subtables: PropTypes.array,
  togglePlugin: PropTypes.func,
  linkedRows: PropTypes.object,
  allViews: PropTypes.array,
  currentTable: PropTypes.object,
  currentView: PropTypes.object,
  addNewView: PropTypes.func,
  toggle: PropTypes.func,
};

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.currentTable.columns,
      showNewViewPopUp: false,
      viewName: "",
      _rows: props.currentTable.rows.filter(
        (r) =>
          props.linkedRows[r._id][Object.keys(props.linkedRows[r._id])[0]]
            .length === 0
      ),
    };
    this.dtable = new DTable();
  }

  onViewNameChange = (e) => {
    this.setState({ viewName: e.target.value });
  };

  onNewViewSubmit = () => {
    const { addNewView, currentTable } = this.props;
    const { viewName } = this.state;

    this.toggleNewViewPopUp();
    addNewView(currentTable, viewName);
  };

  toggleNewViewPopUp = () => {
    this.setState((prev) => ({ showNewViewPopUp: !prev.showNewViewPopUp }));
  };

  render() {
    const { currentTable, allViews, linkedRows, currentView, toggle } =
      this.props;
    const { columns, _rows, showNewViewPopUp, viewName } = this.state;

    return (
      <div className={styles.modal}>
        {/* header  */}
        <div className={styles.modal_header}>
          {/* logo and plugin name  */}
          <div>
            <p className={styles.modal_header_name}>Org Chart</p>
          </div>

          {/* views  */}
          <div className="d-flex w-50 align-items-center">
            {allViews?.map((v) => (
              <button
                key={v.id}
                className={
                  currentView.id === v.id
                    ? styles.modal_header_viewBtn_active
                    : styles.modal_header_viewBtn
                }
              >
                {v.name}
              </button>
            ))}
            <button
              onClick={this.toggleNewViewPopUp}
              className={styles.modal_header_icon_btn}
            >
              <AiOutlinePlus size={17} />
            </button>
          </div>

          {/* settings and close icons  */}
          <div className="w-25 d-flex align-items-center justify-content-end">
            <button className={styles.modal_header_icon_btn}>
              <BiSolidCog size={17} />
            </button>
            <button className={styles.modal_header_icon_btn} onClick={toggle}>
              <CgClose size={17} />
            </button>
          </div>
        </div>

        {/* main body  */}
        <div className={styles.main}>
          {_rows.map((row) => (
            <OrgCard
              row={row}
              key={row._id}
              columns={columns}
              currentTable={currentTable}
              linkedRows={linkedRows}
            />
          ))}
        </div>
        {showNewViewPopUp && (
          <NewViewPopUp
            viewName={viewName}
            onViewNameChange={this.onViewNameChange}
            toggleNewViewPopUp={this.toggleNewViewPopUp}
            onNewViewSubmit={this.onNewViewSubmit}
          />
        )}
      </div>
    );
  }
}

Modal.propTypes = propTypes;

export default Modal;
