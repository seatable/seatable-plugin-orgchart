import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import { colors } from '../../utils/helpers/colors';
import { BiSolidUpArrow, BiSolidDownArrow } from 'react-icons/bi';

const propTypes = {
  currentTable: PropTypes.object,
  columns: PropTypes.array,
  row: PropTypes.object,
  linkedRows: PropTypes.object,
  shownColumns: PropTypes.array,
};

class OrgCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsedCharts: [],
    };
  }

  // logic to toggle collapsed charts 
  toggleChartCollapse = (row_id) => {
    const { collapsedCharts } = this.state;

    if (collapsedCharts.includes(row_id)) {
      this.setState((prev) => ({
        collapsedCharts: prev.collapsedCharts.filter((id) => id !== row_id),
      }));
    } else {
      this.setState((prev) => ({
        collapsedCharts: [...prev.collapsedCharts, row_id],
      }));
    }
  };

  renderCard(row) {
    const { columns, linkedRows, currentTable, shownColumns } = this.props;
    const { collapsedCharts } = this.state;

    // getting all the sub employees of this specific row
    const sub = Object.keys(linkedRows)[0]
      ? currentTable.rows?.filter((r) =>
        linkedRows[r._id][Object.keys(linkedRows[r._id])[0]].includes(row._id)
      )
      : [];

    // check if row has image column (will display placeholder image if not)
    const img = shownColumns.find((c) => c.type === 'image');
    const isImage = img && row[img.key];

    // check if sub cards should be collapsed
    const isCollapsed = collapsedCharts.includes(row._id);

    return (
      <div className="">
        <div className="d-flex flex-column align-items-center">
          <div
            className={`${styles.Person} shadow-sm`}
            style={{ borderTop: `3px solid ${colors()}` }}
            key={row._id}
          >
            <button className={`${styles.Person_toggle_btn} bg-info`} onClick={() => this.toggleChartCollapse(row._id)}>
              {isCollapsed ? <BiSolidDownArrow size={8} color="#fff" /> : <BiSolidUpArrow size={8} color="#fff" />}
            </button>
            {/* render row image (or placeholder) */}
            <figure>
              <img
                src={
                  !isImage
                    ? 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'
                    : isImage[0]
                }
                alt=""
              />
            </figure>

            {/* render row data  */}
            <div className={styles.Person_columns}>
              {columns.map(
                (c, i) =>
                  c.type === 'image' ? '' :
                    (row[c.key] && (
                      <div
                        key={c.key}
                        className={`${!shownColumns.includes(c) ? 'd-none' : ''}`}
                      >
                        <h6>{c.name}</h6>
                        <p className={styles.Person_data}>{row[c.key]}</p>
                      </div>
                    ))
              )}
            </div>
            
          </div>

          {/* check if row has sub rows and render them using recursion */}
          {!isCollapsed && sub[0] && (
            <div
              className={styles.sub}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${sub.length}, 1fr)`,
              }}
            >
              {sub.map((s, i) => (
                <div
                  className={`col ${styles.sub_cards} ${
                    sub.length === 1
                      ? styles.sub_cards_one
                      : i === 0
                        ? styles.sub_cards_f
                        : i === sub.length - 1
                          ? styles.sub_cards_l
                          : ''
                  }`}
                  key={s._id}
                >
                  {this.renderCard(s)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  render() {
    const { row } = this.props;
    return this.renderCard(row);
  }
}

OrgCard.propTypes = propTypes;

export default OrgCard;
