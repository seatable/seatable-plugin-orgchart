import React, { useState, useEffect } from 'react';
import styles from '../../styles/Modal.module.scss';
import styles2 from '../../styles/Presets.module.scss';
import { IHeaderProps } from '../../utils/Interfaces/Header.interface';
import { PLUGIN_ID } from '../../utils/constants';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';

const Header: React.FC<IHeaderProps> = (props) => {
  const {
    presetName,
    isShowPresets,
    onTogglePresets,
    togglePlugin,
    downloadPdfRef,
    fitToScreenRef,
  } = props;

  const printPdfDocument = () => {
    const input = document.getElementById(PLUGIN_ID);

    if (input) {
      document.body.innerHTML = input.innerHTML;
      window.print();
      window.location.reload();
    }
  };

  const downloadPdfDocument = () => {
    if (downloadPdfRef.current) {
      downloadPdfRef.current.click();
    }
  };

  const fitToScreen = () => {
    if (fitToScreenRef.current) {
      fitToScreenRef.current.click();
    }
  };

  return (
    <div className={styles.modal_header}>
      <div className={'d-flex align-items-center justify-content-start'}>
        <div className={`align-items-center ${isShowPresets ? 'd-none' : 'd-flex'} `}>
          <button className={styles2.presets_uncollapse_btn2_settings} onClick={onTogglePresets}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div className={styles.modal_header_pluginName}>
          <p className="font-weight-bold">{presetName}</p>
        </div>
      </div>
      <div
        className={`d-flex align-items-center justify-content-end ${styles.modal_header_settings}`}>
        <span className={styles.modal_header_icon_btn} onClick={fitToScreen}>
          <span className="dtable-font dtable-icon-full-screen"></span>
        </span>
        <span className={styles.modal_header_icon_btn} onClick={downloadPdfDocument}>
          <span className="dtable-font dtable-icon-download"></span>
        </span>
        <span className={styles.modal_header_icon_btn} onClick={printPdfDocument}>
          <span className="dtable-font dtable-icon-print"></span>
        </span>
        <span className={styles.modal_header_icon_btn} onClick={togglePlugin}>
          <span className="dtable-font dtable-icon-x btn-close"></span>
        </span>
      </div>
    </div>
  );
};

export default Header;
