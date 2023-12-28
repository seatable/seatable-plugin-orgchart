import React, { Component } from "react";
import styles from "../../styles/OrgChartSettings.module.scss";
import styles2 from "../../styles/Modal.module.scss";
import DtableSelect from "../Elements/dtable-select";
import { COLUMNS_ICON_CONFIG } from "dtable-utils";
import {
  IOrgChartSettingsProps,
  IOrgChartSettingsState,
} from "../../utils/Interfaces/OrgChartSettings.interface";
import FieldToggle from "../Elements/FieldToggle.tsx";
import { VIEW_NAME } from "../../constants/setting-key.ts";

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
      popupRef: React.createRef()
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    const { toggleSettings } = this.props;

    if (
      this.state.popupRef?.current &&
      !this.state.popupRef.current.contains(event.target)
    ) {
      toggleSettings()
    }
  };

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

  handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    const { currentView, currentTable, shownColumns, updateColumnFieldOrder } = this.props;
    const { dragItemIndex, dragOverItemIndex } = this.state;

    const columns = currentView?.settings?.all_columns[0]
    ? currentView?.settings?.all_columns
    : currentTable.columns;

    const _columns = [...columns];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = _columns.splice(dragItemIndex, 1)[0];
      _columns.splice(dragOverItemIndex, 0, dragItem);
      this.setState({ _columns });
      this.setState({ dragItemIndex: null });
      this.setState({ dragOverItemIndex: null });
      let _shownColumns = _columns.filter((c) => shownColumns.map(c => c.key).includes(c.key))

      updateColumnFieldOrder(
        _shownColumns,
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

  onModifySettings = (selectedOption) => {
    let { plugin_settings, baseViews, updateBaseView, currentViewIdx } = this.props;
    let { value } = selectedOption;
    let name = baseViews.find((v) => v._id === value).name;
    plugin_settings.views[currentViewIdx].settings[VIEW_NAME] =  name;

    updateBaseView(plugin_settings);
  };

  renderViewSelector = () => {
    let { baseViews, currentBaseView } = this.props;
    let options = baseViews.map((item) => {
      let value = item._id;
      let label = item.name;
      return { value, label };
    });
    let selectedOption = options.find(
      (item) => item.value === currentBaseView._id
    );

    return (
      <DtableSelect
        value={selectedOption}
        options={options}
        onChange={this.onModifySettings}
      />
    );
  };

  render() {
    const { handleShownColumn, currentView, currentTable } =
      this.props;
    const { dragOverItemIndex } = this.state;
    const columns = currentView?.settings?.all_columns[0]
      ? currentView?.settings?.all_columns
      : currentTable.columns;

    return (
      <div ref={this.state.popupRef} className={`p-5 bg-white ${styles.settings}`}>
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
              {" "}
              <p>Other fields</p>{" "}
              <button className={styles.settings_show_all}>Show all</button>
            </div>

            {/* hide or show columns (managed with state and not persisted)  */}
            {columns?.map((c: any, i: number) => (
              <div
                key={c.key}
                className={`d-flex justify-content-between align-items-center rounded px-2 py-1 ${styles.settings_column_fields}`}
                style={
                  dragOverItemIndex === i
                    ? { background: "rgba(0, 0, 0, 0.138)" }
                    : {}
                }
                draggable
                onDragStart={(e) => this.handleDragStart(e, i)}
                onDragEnter={(e) => this.handleDragEnter(e, i)}
                onDragEnd={(e) => this.handleDragEnd(e)}
                onDragOver={this.handleDragOver}
              >
                <div className="d-flex align-items-center">
                <i style={{opacity: 1}} className={`dtable-font dtable-icon-drag ${styles2.modal_header_viewBtn_icons}`}></i>
                  <div className="d-flex align-items-center ml-2">
                    <i
                      className={`dtable-font ${COLUMNS_ICON_CONFIG[c.type]}`}
                    />
                    <label className="ml-2 mb-0">{c.name}</label>
                  </div>
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

          {/* <div className={"mt-3"}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="ml-2 mb-0">Show field names</label>
              <FieldToggle
                checked={currentView.settings.show_field_names || false}
                onChange={() => {}}
              />
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default OrgChartSettings;
