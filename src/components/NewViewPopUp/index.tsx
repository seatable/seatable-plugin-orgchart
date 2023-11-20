import React, { Component } from 'react';
import styles from '../../styles/NewViewPopUp.module.scss';
import { INewViewProps } from '../../utils/Interfaces/NewViewPopUp.interface';

class NewViewPopUp extends Component<INewViewProps> {
  render() {
    const { viewName, onViewNameChange, onNewViewSubmit, toggleNewViewPopUp, type, onEditViewSubmit } =
      this.props;
    return (
      <div className={styles.viewPopUp}>
        <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
          <p className="font-weight-bold">{type === 'edit' ? 'Edit View' : 'New View'}</p>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={type === 'edit' ? (e) => toggleNewViewPopUp(e, 'edit') : toggleNewViewPopUp}
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
              type={'text'}
              value={viewName}
              onChange={onViewNameChange}
            />
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <button
              type="button"
              className="btn btn-primary mr-3"
              onClick={onEditViewSubmit ? (e) => onEditViewSubmit(e, 'edit') : onNewViewSubmit}
            >
              {type === 'edit' ? 'Edit' : 'Add'}
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

export default NewViewPopUp;
