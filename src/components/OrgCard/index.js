import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from '../../styles/Modal.module.scss';
import { colors, _colors } from '../../utils/helpers/colors';

const propTypes = {
  currentTable: PropTypes.object,
  columns: PropTypes.array,
  row: PropTypes.object,
  linkedRows: PropTypes.object,
};

class OrgCard extends Component {
  renderCard(row) {
    const { columns, currentTable, linkedRows } = this.props;
    const sub = currentTable.rows.filter((r) =>
      linkedRows[r._id][Object.keys(linkedRows[r._id])[0]].includes(row._id)
    );

    return (
      <div className="">
        <div className="d-flex flex-column align-items-center">
          <div
            className={`${styles.Person} shadow-sm`}
            style={{ borderTop: `3px solid ${colors()}` }}
            key={row._id}
          >
            {columns.map((c, i) =>
              c.type === 'image' ? (
                <figure key={c.key}>
                  <img
                    src={
                      row[c.key]
                        ? row[c.key][0]
                        : 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'
                    }
                    alt=""
                  />
                </figure>
              ) : (
                row[c.key] && (
                  <div key={c.key}>
                    <h6>{c.name}</h6>
                    <p className={styles.Person_data}>{row[c.key]}</p>
                  </div>
                )
              )
            )}
          </div>
          {sub[0] && (
            <div
              className={`${styles.sub}`}
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
