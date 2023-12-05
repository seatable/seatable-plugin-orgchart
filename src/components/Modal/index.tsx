/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import OrgCard from '../OrgCard/index.tsx';
import '../../assets/css/plugin-layout.css';
import { BiSolidCog } from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';
import { RiOrganizationChart } from 'react-icons/ri';
import { IoMdPrint } from 'react-icons/io';
import { PiDownloadSimpleBold } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa6';
import OrgChartSettings from '../OrgChartSettings/index.tsx';
import {
  IModalProps,
  IModalState,
} from '../../utils/Interfaces/Modal.interface';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { canCreateRows } from '../../utils/utils.ts';
import Views from '../Views/index.tsx';

class Modal extends Component<IModalProps, IModalState> {
  _canCreateRows: boolean;
  constructor(props: IModalProps) {
    super(props);
    const TABLE_PERMISSION_TYPE = props.getTablePermissionType();
    this.state = {
      showNewViewPopUp: false,
      showEditViewPopUp: false,
      viewName: '',
      showSettings: false,
    };
    this._canCreateRows = canCreateRows(
      props.currentTable,
      TABLE_PERMISSION_TYPE
    );
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

  // handle download functionality
  downloadPdfDocument = () => {
    const input = document.getElementById('org_chart');

    if (input) {
      html2canvas(input, {
        logging: true,
        allowTaint: false,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4', true);
        pdf.addImage(imgData, 'JPEG', 0, 0, 300, 200);
        pdf.save('chart.pdf');
      });
    }
  };

  // handle print functionality
  printPdfDocument = () => {
    const input = document.getElementById('org_chart');

    if (input) {
      let originalContents = document.body.innerHTML;
      document.body.innerHTML = input.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  // Add new row to plugin
  addOrgChartItem = () => {
    let { rows, currentTable, allViews, currentViewIdx, onAddOrgChartItem } =
      this.props;
    let row_id = rows.length > 0 ? rows[rows.length - 1]._id : '';
    onAddOrgChartItem(allViews[currentViewIdx], currentTable, row_id);
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
      updateColumnFieldOrder,
      duplicateView
    } = this.props;
    const { showNewViewPopUp, showEditViewPopUp, viewName, showSettings } =
      this.state;

    return (
      <div className={styles.modal}>
        <iframe
          id="ifmcontentstoprint"
          style={{ height: '0px', width: '0px', position: 'absolute' }}
        ></iframe>
        {showSettings && (
          <OrgChartSettings
            columns={columns}
            toggleSettings={this.toggleSettings}
            onTablechange={onTablechange}
            subtables={subtables}
            currentTable={currentTable}
            shownColumns={shownColumns}
            allViews={allViews}
            currentView={allViews[currentViewIdx]}
            handleShownColumn={handleShownColumn}
            updateColumnFieldOrder={updateColumnFieldOrder}
            onSelectView={onSelectView}
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

          {/* settings and close icons  */}
          <div
            className={`d-flex align-items-center justify-content-end ${styles.modal_header_settings}`}
          >
            <button
              className={styles.modal_header_icon_btn}
              onClick={this.downloadPdfDocument}
            >
              <PiDownloadSimpleBold size={17} color="#45474B" />
            </button>
            <button
              className={styles.modal_header_icon_btn}
              onClick={this.printPdfDocument}
            >
              <IoMdPrint size={17} color="#45474B" />
            </button>
            <button
              className={`${styles.modal_header_icon_btn} ${
                showSettings ? styles.modal_header_icon_btn_active : ''
              }`}
              onClick={this.toggleSettings}
            >
              <BiSolidCog size={17} color="#45474B" />
              {showSettings && <p>Settings</p>}
            </button>
            <button className={styles.modal_header_icon_btn} onClick={toggle}>
              <CgClose size={17} color="#45474B" />
            </button>
          </div>
        </div>

        {/* main body  */}
        <div className="d-flex position-relative" style={{ height: '100%' }}>
          {/* views  */}
          <Views
            viewName={viewName}
            onViewNameChange={this.onViewNameChange}
            onNewViewSubmit={this.onNewViewSubmit}
            showNewViewPopUp={showNewViewPopUp}
            allViews={allViews}
            onSelectView={onSelectView}
            currentViewIdx={currentViewIdx}
            deleteView={deleteView}
            toggleNewViewPopUp={this.toggleNewViewPopUp}
            onEditViewSubmit={this.onNewViewSubmit}
            showEditViewPopUp={showEditViewPopUp}
            duplicateView={duplicateView}
          />
          <div className={styles.body}>
            <div
              className={styles.main}
              id={'org_chart'}
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
          </div>
        </div>
        
        {this._canCreateRows && (
          <button className={styles.add_row} onClick={this.addOrgChartItem}>
            <FaPlus size={30} color="#fff" />
          </button>
        )}
      </div>
    );
  }
}

export default Modal;
