/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import styles from '../../styles/OrgChartCard.module.scss';
import { OrgChartComponentProps } from '../../utils/Interfaces/CustomPlugin';
import jsPDF from 'jspdf';

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
      chart.exportImg({full:true});
    };
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
        .createZoom(() => {
          return d3.zoom().filter((e) => {
            // Do not zoom on these elements, this is done to enable scrolling
            if (['DIV', 'FIGURE', 'H5', 'SPAN'].includes(e.srcElement.tagName)) {
              return false;
            }
            return true;
          });
        })
        .onExpandOrCollapse((d) => {})
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 150)
        .nodeHeight((d: d3.HierarchyNode<unknown>) => 300)
        .nodeContent((d: any, i: number, arr, state) => {
          let image =
            appActiveState.activeCoverImg &&
            colIDs?.includes(appActiveState.activeCoverImg.key) &&
            d.data[appActiveState.activeCoverImg.key];
          const imageDiffVert = 25 + 2;

          return `<div style='width:${d.width}px;height:${d.height}px;padding-top:${
            imageDiffVert - 2
          }px;'> <div
                class="${styles.card}" style="width:${d.width - 2}px;height:${
                  d.height - imageDiffVert
                }px;">
                <div  style='overflow:scroll;height:100%'>
                <figure class="${styles.card_figure}" style="background-image: url(${
                  image || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'
                })">
                </figure>
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
        .nodeUpdate((d) => {})
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
    <div className="w-100 h-100">
      <button onClick={downloadPdf} ref={downloadPdfRef} style={{ display: 'none' }}>
        Download PDF
      </button>
      <div ref={d3Container} />
    </div>
  );
};

export default OrgChartComponent;
