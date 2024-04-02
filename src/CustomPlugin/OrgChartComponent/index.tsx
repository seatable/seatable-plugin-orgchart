/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import styles from '../../styles/OrgChartCard.module.scss';
import { OrgChartComponentProps } from '../../utils/Interfaces/CustomPlugin';

const OrgChartComponent: React.FC<OrgChartComponentProps> = ({
  pluginPresets,
  appActiveState,
  cardData,
  shownColumns,
}) => {
  const d3Container = useRef(null);
  let chart: OrgChart<unknown> | null = null;
  let showFieldNames = pluginPresets[appActiveState.activePresetIdx].settings?.show_field_names;
  let _shownColumns = shownColumns;
  let colIDs = _shownColumns?.map((s) => s.key);

  useLayoutEffect(() => {
    if (cardData && d3Container.current) {
      if (!chart) {
        chart = new OrgChart();
      }

      chart
        .container(d3Container.current)
        .data(cardData)
        .svgHeight(window.innerHeight - 10)
        .compactMarginBetween((d) => 65)
        .compactMarginPair((d) => 100)
        .neighbourMargin((a, b) => 50)
        .siblingsMargin((d) => 100)
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 150)
        .nodeHeight((d: d3.HierarchyNode<any>) => {
          let image =
            appActiveState.activeCoverImg &&
            colIDs?.includes(appActiveState.activeCoverImg.key) &&
            d.data[appActiveState.activeCoverImg.key];
          let height = shownColumns?.length! * 43;
          let imgShown = shownColumns?.map((c) => c.type).includes('image');

          if (!imgShown) {
            height += 40;
          }
          return image ? height + 110 : height || 50;
        })
        .nodeContent((d: any, i: number, arr, state) => {
          let image =
            appActiveState.activeCoverImg &&
            colIDs?.includes(appActiveState.activeCoverImg.key) &&
            d.data[appActiveState.activeCoverImg.key];

          return `<div style='width:${d.width}px;height:${d.height}px;'> <div
                class="${styles.card} ${!image ? 'py-4' : 'py-0'}">
                <div style='height:100%'>
                ${
                  image
                    ? `<figure class="${styles.card_figure}" style="background-image: url(${image})"></figure>`
                    : ''
                }
                <h5 class="${styles.card_title}">${
                  d.data[appActiveState.activeCardTitle?.key!]
                }</h5>
                <div class="${styles.card_columns}">
                  ${
                    _shownColumns
                      ? _shownColumns?.map((c: any, i) =>
                          c.type === 'image'
                            ? ''
                            : c.type === 'multiple-select' && d.data[c.key]
                              ? `<div key=${c.key}>
                            ${showFieldNames ? `<h6>${c.name}</h6>` : ''}
                            <div class=${styles.card_columns_multi}>
                            ${_shownColumns![i].data.options.map((select: any) =>
                              d.data[c.key]?.includes(select.id)
                                ? `<span key='${select.id}' style='color: ${select.textColor}; background: ${select.color}'>${select.name}</span>`
                                : ''
                            )}
                            </div>
                          </div>`
                              : d.data[c.key] &&
                                `<div key=${c.key}>
                          ${showFieldNames ? `<h6>${c.name}</h6>` : ''}
                            <p class="${styles.card_data}">${d.data[c.key]}</p>
                          </div>`
                        )
                      : ''
                  }
                </div></div>
              </div></div>`.replaceAll(',', '');
        })
        .render();
    }

    // to reset state on unmount
    return () => {
      if (chart) {
        chart.clear();
      };
    };
  }, [cardData, d3Container.current, shownColumns]);

  return (
    // Add your JSX code here
    <div className="w-100 h-100">
      <div ref={d3Container} />
    </div>
  );
};

export default OrgChartComponent;
