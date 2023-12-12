import React, { Component } from 'react';
import ViewItem from '../ViewItem/index.tsx';
import styles from '../../styles/Views.module.scss';
import {
  IViewsProps,
  IViewsState,
} from '../../utils/Interfaces/Views.interface.js';

class Views extends Component<IViewsProps, IViewsState> {
  constructor(props: IViewsProps) {
    super(props);
    this.state = {
      dragItemIndex: null,
      dragOverItemIndex: null,
      _allViews: this.props.allViews,
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
    const {
      allViews,
      onSelectView,
      currentViewIdx,
      deleteView,
      toggleNewViewPopUp,
      viewName,
      showNewViewPopUp,
      onNewViewSubmit,
      onViewNameChange,
      onEditViewSubmit,
      duplicateView,
      showEditViewPopUp,
    } = this.props;
    const { dragOverItemIndex } = this.state;

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
                toggleNewViewPopUp={toggleNewViewPopUp}
                deleteView={deleteView}
                viewName={viewName}
                onViewNameChange={onViewNameChange}
                onEditViewSubmit={onEditViewSubmit}
                showEditViewPopUp={showEditViewPopUp}
                duplicateView={duplicateView}
              />
            </div>
          ))}
        </div>
        {/* add new view input  */}
        {showNewViewPopUp && (
          <div className={styles.views_input}>
            <input autoFocus value={viewName} onChange={onViewNameChange} />
            <button onClick={onNewViewSubmit}>
              <span className="dtable-font dtable-icon-check-mark"></span>
            </button>
            <button onClick={toggleNewViewPopUp}>
              <span className="dtable-font dtable-icon-x btn-close"></span>
            </button>
          </div>
        )}
        {/* add new view button  */}
        {!showNewViewPopUp && (
          <button
            onClick={toggleNewViewPopUp}
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
