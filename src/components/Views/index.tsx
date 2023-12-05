import React, { Component } from 'react';
import ViewItem from '../ViewItem/index.tsx';
import styles from '../../styles/Views.module.scss';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { FaCheck } from 'react-icons/fa6';
import { IViewsProps } from '../../utils/Interfaces/Views.interface.js';

class Views extends Component<IViewsProps> {
  render() {
    const { allViews, onSelectView, currentViewIdx, deleteView , toggleNewViewPopUp, viewName, showNewViewPopUp, onNewViewSubmit, onViewNameChange, onEditViewSubmit, duplicateView, showEditViewPopUp} = this.props;
    return (
      <div className={`${styles.views}`}>
        <div className='d-flex flex-column'>
          {allViews?.map((v) => (
            <ViewItem
              key={v._id}
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
          ))}
        </div>
        {/* add new view input  */}
        {showNewViewPopUp && <div className={styles.views_input}>
          <input autoFocus value={viewName} onChange={onViewNameChange} />
          <button onClick={onNewViewSubmit}><FaCheck color='#ff8001' size={17} /></button>
          <button  onClick={toggleNewViewPopUp}><IoMdClose size={17}  /></button>
        </div>}
        {/* add new view button  */}
        {!showNewViewPopUp && <button
          onClick={toggleNewViewPopUp}
          className={styles.views_add_button}
        >
          <AiOutlinePlus size={17} />
        </button>}
      </div>
    );
  }
}

export default Views;
