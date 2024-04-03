/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import styles from '../../styles/OrgChartCard.module.scss';
import { OrgChartComponentProps } from '../../utils/Interfaces/CustomPlugin';
import jsPDF from 'jspdf';
import { PLUGIN_ID } from '../../utils/constants';

const OrgChartComponent: React.FC<OrgChartComponentProps> = ({
  pluginPresets,
  appActiveState,
  cardData,
  shownColumns,
  downloadPdfRef,
}) => {
  const d3Container = useRef(null);
  let chart: OrgChart<unknown> | null = null;
  let showFieldNames = pluginPresets[appActiveState.activePresetIdx].settings?.show_field_names;
  let _shownColumns = shownColumns;
  let colIDs = _shownColumns?.map((s) => s.key);

  const downloadPdf = () => {
    if (chart) {
      chart.exportImg({ full: true });
    }
  };

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
        .duration(0)
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

          return `<div style="border-radius: 5px;position: relative;background: #fff;margin: 0;width:${
            d.width
          }px;height:${d.height}px;">
                    <div style='position:relative; margin: 0;'>
                      ${
                        image
                          ? `<img class="card-img" src="${image}" style="width: 100%;
                          height: 120px;
                          margin-bottom: 10px;
                          object-fit: cover;
                          position:relative;
                          top: 0;
                          left: 0;
                          " />`
                          : ''
                      }
                      <h5 style="padding: ${
                        !image ? '15px' : '0'
                      } 15px 0;font-size: 11px;margin: 0 0 10px;font-weight: 600;">${
                        d.data[appActiveState.activeCardTitle?.key!]
                      }</h5>
                      <div style="padding: 0 15px 10px;display: flex;flex-direction: column;margin: 0;gap: 10px;">
                        ${
                          _shownColumns
                            ? _shownColumns?.map((c: any, i) =>
                                c.type === 'image'
                                  ? ''
                                  : c.type === 'multiple-select' && d.data[c.key]
                                    ? `<div key=${c.key}>
                                        ${
                                          showFieldNames
                                            ? `<h6 style="text-transform: uppercase;color: #9ba4b5;font-size: 10px;font-weight: 600;" margin: 0;>${c.name}</h6>`
                                            : ''
                                        }
                                        <div style="display: flex;flex-direction: row;gap: 8px;">
                                          ${_shownColumns![i].data.options.map((select: any) =>
                                            d.data[c.key]?.includes(select.id)
                                              ? `<span key='${select.id}' style='color: ${select.textColor}; padding: 2px 10px; border-radius: 8px; background: ${select.color}'>${select.name}</span>`
                                              : ''
                                          )}
                                        </div>
                                      </div>`
                                    : d.data[c.key] &&
                                      `<div key=${c.key}>
                                        ${
                                          showFieldNames
                                            ? `<h6 style="text-transform: uppercase;color: #9ba4b5;font-size: 10px;font-weight: 600; margin: 0 0 5px;">${c.name}</h6>`
                                            : ''
                                        }
                                        <p style="margin: 0;">${d.data[c.key]}</p>
                                     </div>`
                              )
                            : ''
                        }
                </div></div>
              </div>`.replaceAll(',', '');
        })
        .nodeUpdate((d: any) => {
          chart?.duration(500);
        })
        .render();
    }

    // to reset state on unmount
    return () => {
      if (chart) {
        chart.clear();
      }
    };
  }, [cardData, d3Container.current, shownColumns]);

  return (
    // Add your JSX code here
    <div className="w-100 h-100" id={PLUGIN_ID}>
      <button onClick={downloadPdf} ref={downloadPdfRef} style={{ display: 'none' }}>
        Download PDF
      </button>
      <div ref={d3Container} />
    </div>
  );
};

export default OrgChartComponent;
