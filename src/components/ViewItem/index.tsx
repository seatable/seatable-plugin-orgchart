import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import '../../assets/css/plugin-layout.css';

import { BsFillCaretDownFill } from 'react-icons/bs';

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

  render() {
    const { v, allViews, currentViewIdx, onSelectView } = this.props;
    const { showViewDropdown } = this.state;
    return (
      <button
        onClick={() => onSelectView(v?._id)}
        className={
          allViews[currentViewIdx]?._id === v?._id
            ? styles.modal_header_viewBtn_active
            : styles.modal_header_viewBtn
        }
      >
        {v.name}
        {v._id !== '0000' && (
          <span className="ml-2" onClick={this.toggleViewDropdown}>
            <BsFillCaretDownFill color="#A9A9A9" />
          </span>
        )}
        {showViewDropdown && <ViewDropdown deleteView={this.onDeleteView} />}
      </button>
    );
  }
}

export default ViewItem;
