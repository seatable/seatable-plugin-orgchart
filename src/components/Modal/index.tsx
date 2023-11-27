import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import OrgCard from '../OrgCard/index.tsx';
import '../../assets/css/plugin-layout.css';
import NewViewPopUp from '../NewViewPopUp/index.tsx';
import { AiOutlinePlus } from 'react-icons/ai';
import { BiSolidCog } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { RiOrganizationChart } from 'react-icons/ri';
import OrgChartSettings from '../OrgChartSettings/index.tsx';
import {
  IModalProps,
  IModalState,
} from '../../utils/Interfaces/Modal.interface';
import ViewItem from '../ViewItem/index.tsx';

class Modal extends Component<IModalProps, IModalState> {
  constructor(props: IModalProps) {
    super(props);
    this.state = {
      showNewViewPopUp: false,
      showEditViewPopUp: false,
      viewName: '',
      showSettings: false,
    };
  }

  // handle view name change
  onViewNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ viewName: e.currentTarget.value });
  };

  // handle add/edit view functionality
  onNewViewSubmit = (e?, type?: "edit") => {
    const { addNewView, editView } = this.props;
    const { viewName } = this.state;

    if (type === 'edit') {
      editView(viewName);
      this.setState({ viewName: '', showEditViewPopUp: false });
    } else {
      addNewView(viewName);
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

  // toggle settings display
  toggleSettings = () => {
    this.setState((prev) => ({ showSettings: !prev.showSettings }));
  };

  render() {
    const {
      currentTable,
      allViews,
      linkedRows,
      toggle,
      subtables,
      shownColumns,
      onTablechange,
      rows,
      columns,
      handleShownColumn,
      onSelectView,
      deleteView,
      currentViewIdx,
      updateColumnFieldOrder
    } = this.props;
    const { showNewViewPopUp, showEditViewPopUp, viewName, showSettings } =
      this.state;

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
            currentView={allViews[currentViewIdx]}
            handleShownColumn={handleShownColumn}
            updateColumnFieldOrder={updateColumnFieldOrder}
          />
        )}
        {/* header  */}
        <div className={styles.modal_header}>
          {/* logo and plugin name  */}
          <div className="d-flex align-items-center">
            <div
              className={`bg-info py-1 px-2 rounded mr-2 ${styles.modal_header_logo}`}
            >
              <RiOrganizationChart size={16} color="#fff" />
            </div>
            <p className={styles.modal_header_name}>Org Chart</p>
          </div>

          {/* views  */}
          <div className="d-flex w-50 align-items-center">
            <div className={styles.modal_header_views}>
              {allViews?.map((v) => (
                <ViewItem
                  key={v._id}
                  v={v}
                  onSelectView={onSelectView}
                  allViews={allViews}
                  currentViewIdx={currentViewIdx}
                  toggleNewViewPopUp={this.toggleNewViewPopUp}
                  deleteView={deleteView}
                />
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
          <div
            className={`d-flex align-items-center justify-content-end ${styles.modal_header_settings}`}
          >
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
        <div
          className={styles.main}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${rows.length}, 1fr)`,
          }}
        >
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

        {showEditViewPopUp && (
          <NewViewPopUp
            viewName={viewName}
            onViewNameChange={this.onViewNameChange}
            toggleNewViewPopUp={this.toggleNewViewPopUp}
            onEditViewSubmit={this.onNewViewSubmit}
            type="edit"
          />
        )}
      </div>
    );
  }
}

export default Modal;
