import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import {
  IViewDropdownProps,
  IViewDropdownState,
} from '../../utils/Interfaces/ViewDropdown.interfaces';

class ViewDropdown extends Component<IViewDropdownProps, IViewDropdownState> {
  render() {
    const { deleteView, editView } = this.props;
    return (
      <ul className={styles.view_dropdown}>
        <li>Rename View</li>
        <li onClick={deleteView}>Delete View</li>
      </ul>
    );
  }
}

export default ViewDropdown;
