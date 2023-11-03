import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import OrgCard from '../OrgCard/index.tsx';
import '../../assets/css/plugin-layout.css';
import NewViewPopUp from '../NewViewPopUp/index.tsx';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSolidCog } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { RiOrganizationChart  } from 'react-icons/ri';
import OrgChartSettings from '../OrgChartSettings/index.tsx';
import { IModalProps, IModalState } from '../../utils/Interfaces/Modal.interface';

class Modal extends Component<IModalProps, IModalState> {
  constructor(props: IModalProps) {
    super(props);
    this.state = {
      showNewViewPopUp: false,
      viewName: '',
      showSettings: false,
    };
  }

  // handle view name change 
  onViewNameChange = (e:React.FormEvent<HTMLInputElement>) => {
    this.setState({ viewName: e.currentTarget.value });
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

export default Modal;
