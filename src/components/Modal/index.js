import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import OrgCard from '../OrgCard';
import '../../assets/css/plugin-layout.css';
import NewViewPopUp from '../NewViewPopUp';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSolidCog } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { RiOrganizationChart  } from 'react-icons/ri';
import OrgChartSettings from '../OrgChartSettings';

const propTypes = {
  subtables: PropTypes.array,
  togglePlugin: PropTypes.func,
  linkedRows: PropTypes.object,
  allViews: PropTypes.array,
  currentTable: PropTypes.object,
  currentView: PropTypes.object,
  addNewView: PropTypes.func,
  toggle: PropTypes.func,
  shownColumns: PropTypes.array,
  rows: PropTypes.array,
  columns: PropTypes.array,
  onTablechange: PropTypes.func,
  handleShownColumn: PropTypes.func
};

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewViewPopUp: false,
      viewName: '',
      showSettings: false,
    };
  }

  // handle view name change 
  onViewNameChange = (e) => {
    this.setState({ viewName: e.target.value });
  };

  // handle add view functionality 
  onNewViewSubmit = () => {
    const { addNewView, currentTable } = this.props;
    const { viewName } = this.state;

    this.toggleNewViewPopUp();
    addNewView(currentTable, viewName);
  };

  // toggle new view popup display 
  toggleNewViewPopUp = () => {
    this.setState((prev) => ({ showNewViewPopUp: !prev.showNewViewPopUp }));
  };

  // toggle settings display 
  toggleSettings = () => {
    this.setState((prev) => ({ showSettings: !prev.showSettings }));
  };

  render() {
    const {
      currentTable,
      allViews,
      linkedRows,
      currentView,
      toggle,
      subtables,
      shownColumns,
      onTablechange,
      rows,
      columns,
      handleShownColumn
    } = this.props;
    const { showNewViewPopUp, viewName, showSettings } = this.state;

    return (
      <div className={styles.modal}>
        {showSettings && (
          <OrgChartSettings
            columns={columns}
            toggleSettings={this.toggleSettings}
            onTablechange={onTablechange}
            subtables={subtables}
            currentTable={currentTable}
            shownColumns={shownColumns}
            handleShownColumn={handleShownColumn}
          />
        )}
        {/* header  */}
        <div className={styles.modal_header}>
          {/* logo and plugin name  */}
          <div className='d-flex align-items-center'>
            <div className={`bg-info py-1 px-2 rounded mr-2 ${styles.modal_header_logo}`}><RiOrganizationChart size={16} color='#fff' /></div>
            <p className={styles.modal_header_name}>Org Chart</p>
          </div>

          {/* views  */}
          <div className="d-flex w-50 align-items-center">
            <div className={styles.modal_header_views}>
              {allViews?.map((v) => (
                <button
                  key={v._id}
                  className={
                    currentView._id === v._id
                      ? styles.modal_header_viewBtn_active
                      : styles.modal_header_viewBtn
                  }
                >
                  {v.name}
                </button>
              ))}
            </div>
            {/* add new view button  */}
            <button
              onClick={this.toggleNewViewPopUp}
              className={styles.modal_header_icon_btn}
            >
              <AiOutlinePlus size={17} />
            </button>
          </div>

          {/* settings and close icons  */}
          <div className={`d-flex align-items-center justify-content-end ${styles.modal_header_settings}`}>
            <button
              className={styles.modal_header_icon_btn}
              onClick={this.toggleSettings}
            >
              <BiSolidCog size={17} />
            </button>
            <button className={styles.modal_header_icon_btn} onClick={toggle}>
              <CgClose size={17} />
            </button>
          </div>
        </div>

        {/* main body  */}
        <div className={styles.main}   style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${rows.length}, 1fr)`,
        }}>
          {rows.map((row) => (
            <OrgCard
              row={row}
              key={row._id}
              columns={columns}
              shownColumns={shownColumns}
              currentTable={currentTable}
              linkedRows={linkedRows}
            />
          ))}
        </div>
        {showNewViewPopUp && (
          <NewViewPopUp
            viewName={viewName}
            onViewNameChange={this.onViewNameChange}
            toggleNewViewPopUp={this.toggleNewViewPopUp}
            onNewViewSubmit={this.onNewViewSubmit}
          />
        )}
      </div>
    );
  }
}

Modal.propTypes = propTypes;

export default Modal;
