import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import { RiOrganizationChart } from 'react-icons/ri';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { IOrgChartHeaderProps } from '../../utils/Interfaces/OrgChartHeader.interface';

class OrgChartHeader extends Component<IOrgChartHeaderProps> {
  // handle print functionality
  printPdfDocument = () => {
    const input = document.getElementById('org_chart');  // insert element id

    if (input) {
      let originalContents = document.body.innerHTML;
      document.body.innerHTML = input.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

    // handle download functionality
    downloadPdfDocument = () => {
      const input = document.getElementById('org_chart'); // insert element id
    
      if (input) {
        html2canvas(input, {
          logging: true,
          allowTaint: false,
          useCORS: true,
        }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('l', 'mm', 'a4', true);
          pdf.addImage(imgData, 'JPEG', 0, 0, 230, 200);
          pdf.save('org_chart.pdf');
        });
      }
    };

    render() {
      const { showSettings, toggleSettings, toggle } = this.props;
      return (
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
              <span className="dtable-font dtable-icon-download"></span>
            </button>
            <button
              className={styles.modal_header_icon_btn}
              onClick={this.printPdfDocument}
            >
              <span className="dtable-font dtableprint-icon"></span>
            </button>
            <button
              className={`${styles.modal_header_icon_btn} ${
                showSettings ? styles.modal_header_icon_btn_active : ''
              }`}
              onClick={toggleSettings}
            >
              <span className="dtable-font dtable-icon-set-up"></span>
              {showSettings && <p>Settings</p>}
            </button>
            <button className={styles.modal_header_icon_btn} onClick={toggle}>
              <span className="dtable-font dtable-icon-x btn-close"></span>
            </button>
          </div>
        </div>
      );
    }
}

export default OrgChartHeader;