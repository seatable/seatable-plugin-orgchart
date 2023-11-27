import React, { Component } from 'react';
import modal_styles from '../../styles/Modal.module.scss';
import styles from '../../styles/OrgChartSettings.module.scss';
import { CgClose } from 'react-icons/cg';
import { IOrgChartSettingsProps, IOrgChartSettingsState } from '../../utils/Interfaces/OrgChartSettings.interface';

class OrgChartSettings extends Component<IOrgChartSettingsProps, IOrgChartSettingsState> {
  constructor(props: IOrgChartSettingsProps) {
    super(props);
    this.state = {
      dragItemIndex: null,
      dragOverItemIndex: null,
      _columns: this.props.columns
    };
  }

  // drag and drop logic
  handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    this.setState({dragItemIndex: index});
  };

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    this.setState({dragOverItemIndex: index});
  };

  handleDragEnd = (e: React.DragEvent<HTMLDivElement>, c_id: string) => {
    const { columns, shownColumns,  updateColumnFieldOrder } = this.props;
    const { dragItemIndex, dragOverItemIndex } = this.state;

    const _columns = [...columns];
    if(dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = _columns.splice(dragItemIndex, 1)[0];
      _columns.splice(dragOverItemIndex, 0, dragItem);
      this.setState({ _columns });
      this.setState({ dragItemIndex: null });
      this.setState({ dragOverItemIndex: null });
  
      updateColumnFieldOrder(_columns.filter(c => shownColumns.includes(c)), _columns);
    }
  };

  checkIfFieldShouldBeChecked = (c: any) => {
    const { shownColumns } = this.props;

    return shownColumns.map(c => c.key).includes(c.key);
  }

  render() {
    const {
      toggleSettings,
      subtables,
      currentTable,
      onTablechange,
      handleShownColumn,
      currentView
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
            {currentView.settings.all_columns?.map((c: any, i: number) => (
              <div
                key={c.key}
                className="d-flex justify-content-between align-items-center mb-2"
                draggable
                onDragStart={(e) => this.handleDragStart(e, i)}
                onDragEnter={(e) => this.handleDragEnter(e, i)}
                onDragEnd={(e) => this.handleDragEnd(e, c.key)}
                onDragOver={this.handleDragOver}
              >
                <label>{c.name}</label>
                <input
                  value={c.key}
                  defaultChecked={this.checkIfFieldShouldBeChecked(c)}
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
