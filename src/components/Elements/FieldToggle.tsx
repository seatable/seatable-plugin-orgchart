import React, { Component } from 'react';
import { IFieldToggleProps } from '../../utils/Interfaces/FieldToggle.interface';
import styles from '../../styles/FieldToggle.module.scss';

class FieldToggle extends Component<IFieldToggleProps> {
  render() {
    const { checked, onChange } = this.props;
    return (
      <div
        onClick={onChange}
        className={`${styles.toggle_switch} ${
          checked ? styles.toggle_switch_active : ''
        }`}
      ></div>
    );
  }
}

export default FieldToggle;
