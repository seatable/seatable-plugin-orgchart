import React, { Component } from 'react';
import modal_styles from '../../styles/Modal.module.scss';
import styles from '../../styles/OrgChartSettings.module.scss';
import { CgClose } from 'react-icons/cg';
import { IOrgChartSettingsProps } from '../../utils/Interfaces/OrgChartSettings.interface';


class OrgChartSettings extends Component<IOrgChartSettingsProps> {
  render() {
    const {
      columns,
      toggleSettings,
      subtables,
      currentTable,
      shownColumns,
      onTablechange,
      handleShownColumn
    } = this.props;

    return (
      <div className={`p-5 shadow-lg bg-white ${styles.settings}`}>
        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom border-light">
          <h5 className="font-weight-bold">Settings</h5>
          <button
            className={modal_styles.modal_header_icon_btn}
            onClick={toggleSettings}
          >
            <CgClose size={17} />
          </button>
        </div>

        <div className="pt-3">
          <div>
            <h6 className="d-inline-block mb-3">Table</h6>
            {/* toggle table view  */}
            <select
              value={currentTable._id}
              onChange={(e) => onTablechange(e.target.value)}
              className="w-100 p-2"
            >
              {subtables.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <h6 className="mb-3">Other fields</h6>
            {/* hide or show columns (managed with state and not persisted)  */}
            {columns.map((c) => (
              <div
                key={c.key}
                className="d-flex justify-content-between align-items-center mb-2"
              >
                <label>{c.name}</label>
                <input
                  value={c.key}
                  defaultChecked={shownColumns.includes(c)}
                  type={'checkbox'}
                  onChange={handleShownColumn}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default OrgChartSettings;
