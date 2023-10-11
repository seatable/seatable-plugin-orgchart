import PropTypes from "prop-types";
import React, { Component } from "react";
import styles from "../../styles/NewViewPopUp.module.scss";

const propTypes = {
  viewName: PropTypes.string,
  onViewNameChange: PropTypes.func,
  onNewViewSubmit: PropTypes.func,
  toggleNewViewPopUp: PropTypes.func,
};

class NewViewPopUp extends Component {
  render() {
    const { viewName, onViewNameChange, onNewViewSubmit, toggleNewViewPopUp } =
      this.props;
    return (
      <div className={styles.viewPopUp}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <p className="font-weight-bold">New View</p>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={toggleNewViewPopUp}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form className="p-3">
          <div>
            <label className="d-inline-block">Name</label>
            <input
              className="w-100 p-2"
              autoFocus
              type={"text"}
              value={viewName}
              onChange={onViewNameChange}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              type="button"
              className="btn btn-primary mr-3"
              onClick={onNewViewSubmit}
            >
              Add
            </button>
            <button
              type="button"
              className="btn btn-light"
              onClick={toggleNewViewPopUp}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

NewViewPopUp.propTypes = propTypes;
export default NewViewPopUp;
