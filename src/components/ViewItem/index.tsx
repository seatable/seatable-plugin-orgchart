import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import styles2 from '../../styles/Views.module.scss';
import '../../assets/css/plugin-layout.css';
import { BsThreeDots } from 'react-icons/bs';
import ViewDropdown from '../ViewDropdown/index.tsx';
import {
  IViewItemProps,
  IViewItemState,
} from '../../utils/Interfaces/ViewItem.interfaces';

class ViewItem extends Component<IViewItemProps, IViewItemState> {
  constructor(props: IViewItemProps) {
    super(props);
    this.state = {
      showViewDropdown: false,
      isEditing: false,
      popupRef: React.createRef(),
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  handleOutsideClick = (event) => {
    if (
      this.state.popupRef?.current &&
      !this.state.popupRef.current.contains(event.target)
    ) {
      // Click outside the popup, close it
      this.setState({
        showViewDropdown: false,
      });
    }
  };

  // toggle view dropdown(edit/delete)
  toggleViewDropdown = () => {
    this.setState((prev) => ({ showViewDropdown: !prev.showViewDropdown }));
  };

  // delete a view
  onDeleteView = () => {
    const { deleteView } = this.props;
    deleteView();
    this.toggleViewDropdown();
  };

  // edit a view
  onEditView = (e) => {
    const { toggleNewViewPopUp } = this.props;
    this.setState((prev) => ({
      isEditing: !prev.isEditing,
      showViewDropdown: false,
    }));
    toggleNewViewPopUp(e, 'edit');
  };

  onDuplicateView = () => {
    const { duplicateView, v } = this.props;

    duplicateView(`${v.name} copy`);
    this.toggleViewDropdown();
  };

  onClickView = (e) => {
    const { onSelectView, v } = this.props;

    if (e.detail === 2) {
      this.onEditView(e);
    } else {
      onSelectView(v?._id);
    }
  };

  render() {
    const {
      v,
      allViews,
      currentViewIdx,
      viewName,
      onViewNameChange,
      onEditViewSubmit,
    } = this.props;
    const { showViewDropdown, isEditing, popupRef } = this.state;
    return (
      <div>
        <div
          className={styles2.views_input}
          style={{ display: !isEditing ? 'none' : 'flex' }}
        >
          <input autoFocus value={viewName} onChange={onViewNameChange} />
          <button onClick={(e) => onEditViewSubmit(e, 'edit')}>
            <span className="dtable-font dtable-icon-check-mark"></span>
          </button>
          <button onClick={this.onEditView}>
            <span className="dtable-font dtable-icon-x btn-close"></span>
          </button>
        </div>

        <div
          onClick={this.onClickView}
          style={{ display: isEditing ? 'none' : 'flex' }}
          className={
            allViews[currentViewIdx]?._id === v?._id
              ? styles.modal_header_viewBtn_active
              : styles.modal_header_viewBtn
          }
        >
          <div className="d-flex align-items-center">
            <i className={`dtable-font dtable-icon-drag ${styles.modal_header_viewBtn_icons}`}></i>
            <p className="ml-2 mb-0"> {v.name}</p>
          </div>

          <span onClick={this.toggleViewDropdown}>
            <BsThreeDots
              color="#191717"
              className={styles.modal_header_viewBtn_icons}
            />
          </span>

          {showViewDropdown && (
            <ViewDropdown
              dropdownRef={popupRef}
              deleteView={this.onDeleteView}
              toggleEditViewPopUp={this.onEditView}
              duplicateView={this.onDuplicateView}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ViewItem;
