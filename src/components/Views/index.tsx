//@ts-nocheck
import React, { Component } from 'react';
import ViewItem from '../ViewItem/index.tsx';
import styles from '../../styles/Views.module.scss';
import deepCopy from 'deep-copy';
import View from '../../model/view.ts';
import {
  IViewsProps,
  IViewsState,
} from '../../utils/Interfaces/Views.interface.ts';
import { generatorViewId } from '../../utils/utils.ts';
import { TABLE_NAME } from '../../constants/setting-key.ts';

class Views extends Component<IViewsProps, IViewsState> {
  constructor(props: IViewsProps) {
    super(props);
    this.state = {
      dragItemIndex: null,
      dragOverItemIndex: null,
      _allViews: this.props.allViews,
      viewName: '',
      showNewViewPopUp: false,
      showEditViewPopUp: false,
    };
  }

  getSelectedTable = (tables: any, settings = {}) => {
    let selectedTable = window.dtableSDK.getTableByName(settings[TABLE_NAME]);
    if (!selectedTable) {
      return tables[0];
    }
    return selectedTable;
  };

  initOrgChartSetting = (settings = {}) => {
    let initUpdated = {};
    let tables = window.dtableSDK.getTables();
    let selectedTable = this.getSelectedTable(tables, settings);
    let titleColumn = selectedTable.columns.find(
      (column: any) => column.key === '0000'
    );
    let imageColumn = selectedTable.columns.find(
      (column: any) => column.type === 'image'
    );
    let imageName = imageColumn ? imageColumn.name : null;
    let titleName = titleColumn ? titleColumn.name : null;
    initUpdated = Object.assign(
      {},
      { shown_image_name: imageName },
      { shown_title_name: titleName },
      { shown_column_names: selectedTable.columns.map((c: any) => c.name) },
      { all_columns: selectedTable.columns }
    );
    return initUpdated;
  };

  // handle view name change
  onViewNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ viewName: e.currentTarget.value });
  };

  // handle add/edit view functionality
  onNewViewSubmit = (e?, type?: "edit") => {
    const { viewName } = this.state;

    if (type === 'edit') {
      this.editView(viewName);
      this.setState({ viewName: '', showEditViewPopUp: false });
    } else {
      this.addView(viewName);
      this.setState({ viewName: '', showNewViewPopUp: false });
    }
  };

  // toggle new/edit view popup display
  toggleNewViewPopUp = (e?, type?: "edit") => {
    const { allViews, currentViewIdx } = this.props;

    if (type === 'edit') {
      const viewName = allViews.find((v, i) => i === currentViewIdx).name;
      this.setState((prev) => ({
        showEditViewPopUp: !prev.showEditViewPopUp,
        viewName,
      }));
    } else {
      this.setState((prev) => ({ showNewViewPopUp: !prev.showNewViewPopUp }));
    }
  };

  // add new view
  addView = (viewName: string) => {
    let { allViews, plugin_settings } = this.props;
    const { updateViews } = this.props;

    let currentViewIdx = allViews.length;
    let _id: string = generatorViewId(allViews) || '';
    let newView = new View({ _id, name: viewName });
    let newViews = deepCopy(allViews);
    newViews.push(newView);

    let initUpdated = this.initOrgChartSetting();
    newViews[currentViewIdx].settings = Object.assign({}, initUpdated);
    plugin_settings.views = newViews;

    updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // duplicate a view
  duplicateView = (name: string) => {
    this.addView(name);
  };

  // edit view name
  editView = (viewName: string) => {
    let { currentViewIdx, plugin_settings } = this.props;
    const { allViews, updateViews } = this.props;
    let newViews = deepCopy(allViews);
    let oldView = allViews[currentViewIdx];
    let _id: string = generatorViewId(allViews) || '';
    let updatedView = new View({ ...oldView, _id, name: viewName });

    newViews.splice(currentViewIdx, 1, updatedView);
    plugin_settings.views = newViews;

    updateViews(currentViewIdx, newViews, plugin_settings);
  };

  // delete view
  deleteView = () => {
    let { currentViewIdx, plugin_settings } = this.props;
    const { allViews, updateViews } = this.props;
    let newViews = deepCopy(allViews);
    newViews.splice(currentViewIdx, 1);
    if (currentViewIdx >= newViews.length) {
      currentViewIdx = newViews.length - 1;
    }
    plugin_settings.views = newViews;

    updateViews(0, newViews, plugin_settings);
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

  handleDragEnd = (e: React.DragEvent<HTMLDivElement>, v_id: string) => {
    const { allViews, updateViews, currentViewIdx, plugin_settings } =
      this.props;
    const { dragItemIndex, dragOverItemIndex } = this.state;

    const _allViews = [...allViews];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = _allViews.splice(dragItemIndex, 1)[0];
      _allViews.splice(dragOverItemIndex, 0, dragItem);
      this.setState({ _allViews });
      this.setState({ dragItemIndex: null });
      this.setState({ dragOverItemIndex: null });
      let _plugin_settings = { ...plugin_settings, views: _allViews };

      updateViews(currentViewIdx, _allViews, _plugin_settings);
    }
  };

  render() {
    const { allViews, onSelectView, currentViewIdx } = this.props;
    const { dragOverItemIndex, viewName, showNewViewPopUp, showEditViewPopUp } =
      this.state;

    return (
      <div className={`${styles.views}`}>
        <div className="d-flex flex-column">
          {allViews?.map((v, i) => (
            <div
              style={
                dragOverItemIndex === i
                  ? { borderTop: '2px solid #A9A9A9' }
                  : {}
              }
              key={v._id}
              draggable
              onDragStart={(e) => this.handleDragStart(e, i)}
              onDragEnter={(e) => this.handleDragEnter(e, i)}
              onDragEnd={(e) => this.handleDragEnd(e, v._id)}
              onDragOver={this.handleDragOver}
            >
              <ViewItem
                v={v}
                onSelectView={onSelectView}
                allViews={allViews}
                currentViewIdx={currentViewIdx}
                toggleNewViewPopUp={this.toggleNewViewPopUp}
                deleteView={this.deleteView}
                viewName={viewName}
                onViewNameChange={this.onViewNameChange}
                onEditViewSubmit={(e) => this.onNewViewSubmit(e, 'edit')}
                showEditViewPopUp={showEditViewPopUp}
                duplicateView={this.duplicateView}
              />
            </div>
          ))}
        </div>
        {/* add new view input  */}
        {showNewViewPopUp && (
          <div className={styles.views_input}>
            <input
              autoFocus
              value={viewName}
              onChange={this.onViewNameChange}
            />
            <button onClick={this.onNewViewSubmit}>
              <span className="dtable-font dtable-icon-check-mark"></span>
            </button>
            <button onClick={this.toggleNewViewPopUp}>
              <span className="dtable-font dtable-icon-x btn-close"></span>
            </button>
          </div>
        )}
        {/* add new view button  */}
        {!showNewViewPopUp && (
          <button
            onClick={this.toggleNewViewPopUp}
            className={styles.views_add_button}
          >
            <i className="dtable-font dtable-icon-add-table"></i>
          </button>
        )}
      </div>
    );
  }
}

export default Views;
