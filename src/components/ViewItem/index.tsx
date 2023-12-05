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
import { IoMdClose } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa6';

class ViewItem extends Component<IViewItemProps, IViewItemState> {
  constructor(props: IViewItemProps) {
    super(props);
    this.state = {
      showViewDropdown: false,
      isEditing: false,
    };
  }

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

  render() {
    const {
      v,
      allViews,
      currentViewIdx,
      onSelectView,
      viewName,
      onViewNameChange,
      onEditViewSubmit,
    } = this.props;
    const { showViewDropdown, isEditing } = this.state;
    return (
      <div>
        <div
          className={styles2.views_input}
          style={{ display: !isEditing ? 'none' : 'flex' }}
        >
          <input autoFocus value={viewName} onChange={onViewNameChange} />
          <button onClick={(e) => onEditViewSubmit(e, 'edit')}>
            <FaCheck color="#ff8001" size={17} />
          </button>
          <button onClick={this.onEditView}>
            <IoMdClose size={17} />
          </button>
        </div>

        <div
          onClick={() => onSelectView(v?._id)}
          style={{ display: isEditing ? 'none' : 'flex' }}
          className={
            allViews[currentViewIdx]?._id === v?._id
              ? styles.modal_header_viewBtn_active
              : styles.modal_header_viewBtn
          }
        >
          {v.name}
          {v._id !== '0000' && (
            <span onClick={this.toggleViewDropdown}>
              <BsThreeDots color="#191717" />
            </span>
          )}
          {showViewDropdown && (
            <ViewDropdown
              deleteView={this.onDeleteView}
              toggleEditViewPopUp={this.onEditView}
            />
          )}
        </div>
      </div>
    );
  }
}

export default ViewItem;
