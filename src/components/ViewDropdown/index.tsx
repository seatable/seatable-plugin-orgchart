import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import {
  IViewDropdownProps,
  IViewDropdownState,
} from '../../utils/Interfaces/ViewDropdown.interfaces';

class ViewDropdown extends Component<IViewDropdownProps, IViewDropdownState> {
  render() {
    const { deleteView, toggleEditViewPopUp, duplicateView, dropdownRef } =
      this.props;
    return (
      <ul ref={dropdownRef} className={styles.view_dropdown}>
        <li onClick={toggleEditViewPopUp} className="d-flex align-items-center">
          <i className="item-icon dtable-font dtable-icon-rename"></i>
          <p className="ml-2">Rename View</p>
        </li>
        <li onClick={duplicateView} className="d-flex align-items-center">
          <i className="item-icon dtable-font dtable-icon-copy"></i>
          <p className="ml-2">Duplicate View</p>
        </li>
        <li onClick={deleteView} className="d-flex align-items-center">
          <i className="item-icon dtable-font dtable-icon-delete"></i>
          <p className="ml-2">Delete View</p>
        </li>
      </ul>
    );
  }
}

export default ViewDropdown;
