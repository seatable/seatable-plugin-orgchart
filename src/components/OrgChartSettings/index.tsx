import React, { Component } from 'react';
import styles from '../../styles/OrgChartSettings.module.scss';
import DtableSelect from '../Elements/dtable-select';
import { MdDragIndicator } from 'react-icons/md';
import {
  IOrgChartSettingsProps,
  IOrgChartSettingsState,
} from '../../utils/Interfaces/OrgChartSettings.interface';
import FieldToggle from '../Elements/FieldToggle.tsx';

class OrgChartSettings extends Component<
  IOrgChartSettingsProps,
  IOrgChartSettingsState
> {
  constructor(props: IOrgChartSettingsProps) {
    super(props);
    this.state = {
      dragItemIndex: null,
      dragOverItemIndex: null,
      _columns: this.props.columns,
    };
  }

  // drag and drop logic
  handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    this.setState({ dragItemIndex: index });
  };

  handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    this.setState({ dragOverItemIndex: index });
  };

  handleDragEnd = (e: React.DragEvent<HTMLDivElement>, c_id: string) => {
    const { columns, shownColumns, updateColumnFieldOrder } = this.props;
    const { dragItemIndex, dragOverItemIndex } = this.state;

    const _columns = [...columns];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = _columns.splice(dragItemIndex, 1)[0];
      _columns.splice(dragOverItemIndex, 0, dragItem);
      this.setState({ _columns });
      this.setState({ dragItemIndex: null });
      this.setState({ dragOverItemIndex: null });

      updateColumnFieldOrder(
        _columns.filter((c) => shownColumns.includes(c)),
        _columns
      );
    }
  };

  checkIfFieldShouldBeChecked = (c: any) => {
    const { shownColumns } = this.props;

    return shownColumns.map((c) => c.key).includes(c.key);
  };

  renderTableSelector = () => {
    let { currentTable, subtables, onTablechange } = this.props;
    let options = subtables.map((item) => {
      let value = item._id;
      let label = item.name;
      return { value, label };
    });
    let selectedOption = options.find(
      (item) => item.value === currentTable._id
    );

    return (
      <DtableSelect
        value={selectedOption}
        options={options}
        onChange={onTablechange}
      />
    );
  };

  renderViewSelector = () => {
    let { allViews, currentView, onSelectView } = this.props;
    let options = allViews.map((item) => {
      let value = item._id;
      let label = item.name;
      return { value, label };
    });
    let selectedOption = options.find((item) => item.value === currentView._id);

    return (
      <DtableSelect
        value={selectedOption}
        options={options}
        onChange={(v) => onSelectView(v.value)}
      />
    );
  };

  render() {
    const { handleShownColumn, currentView, currentTable } = this.props;
    const columns = currentView?.settings?.all_columns[0] ? currentView?.settings?.all_columns : currentTable.columns;

    return (
      <div className={`p-5 bg-white ${styles.settings}`}>
        <div>
          <div className={styles.settings_dropdowns}>
            <div>
              <p className="d-inline-block mb-2">Table</p>
              {/* toggle table view  */}
              {this.renderTableSelector()}
            </div>

            <div>
              <p className="d-inline-block mb-2 mt-3">View</p>
              {/* toggle table view  */}
              {this.renderViewSelector()}
            </div>
          </div>

          <div className={`mt-4 ${styles.settings_dropdowns}`}>
            <div className="mb-3 d-flex justify-content-between align-items-center">
              {' '}
              <p>Other fields</p>{' '}
              <button className={styles.settings_show_all}>Show all</button>
            </div>

            {/* hide or show columns (managed with state and not persisted)  */}
            {columns?.map((c: any, i: number) => (
              <div
                key={c.key}
                className="d-flex justify-content-between align-items-center mb-2"
                draggable
                onDragStart={(e) => this.handleDragStart(e, i)}
                onDragEnter={(e) => this.handleDragEnter(e, i)}
                onDragEnd={(e) => this.handleDragEnd(e, c.key)}
                onDragOver={this.handleDragOver}
              >
                <div className="d-flex align-items-center">
                  {' '}
                  <MdDragIndicator color="#C2C2C2" size={17} />
                  <label className="ml-2 mb-0">{c.name}</label>
                </div>

                <FieldToggle
                  checked={this.checkIfFieldShouldBeChecked(c)}
                  onChange={() =>
                    handleShownColumn(
                      c.key,
                      this.checkIfFieldShouldBeChecked(c)
                    )
                  }
                />
              </div>
            ))}
          </div>

          <div className={'mt-3'}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="ml-2 mb-0">Show field names</label>
              <FieldToggle
                checked={currentView.settings.show_field_names || false}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OrgChartSettings;
