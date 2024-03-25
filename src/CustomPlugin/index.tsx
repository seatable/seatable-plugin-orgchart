/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import { IPresetInfo } from '../utils/Interfaces/PluginPresets/Presets.interface';
import { showFieldNames } from '../utils/utils';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import styles from '../styles/OrgChartCard.module.scss';
import '../styles/OrgChartCard.module.scss';
import { parseRowsData } from '../utils/utils';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
  shownColumns,
}) => {
  const [cardData, setCardData] = useState<any[]>(); // row (card) data
  useEffect(() => {
    let data = parseRowsData(
      appActiveState.activeTable,
      appActiveState.activeViewRows,
      appActiveState.activeRelationship
    );
    setCardData(data);
  }, [appActiveState]);

  const d3Container = useRef(null);
  let chart: OrgChart<unknown> | null = null;

  // DOM Manipulation
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
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 150)
        .nodeHeight((d: d3.HierarchyNode<unknown>) => 300)
        .onNodeClick((d: d3.HierarchyNode<unknown>) => {
          alert('Id of clicked node ');
        })
        .nodeContent((d: any, i: number) => {
          let colIDs = shownColumns?.map((s) => s.key);
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
            <h5 class="${styles.card_title}">${d.data[appActiveState.activeCardTitle?.key!]}</h5>
            <div class="${styles.card_columns}">
              ${shownColumns ? shownColumns?.map((c: any, i) =>
                c.type === 'image'
                  ? ''
                  : c.type === 'multiple-select' && d.data[c.key]
                    ? `<div key=${c.key}>
                        <h6>${c.name}</h6>
                        <div class=${styles.card_columns_multi}>
                        ${shownColumns[i].data.options.map((select: any) =>
                          d.data[c.key]?.includes(select.id)
                            ? `<span key='${select.id}' style='color: ${select.textColor}; background: ${select.color}'>${select.name}</span>`
                            : ''
                        )}
                        </div>
                      </div>`
                    : d.data[c.key] &&
                      `<div key=${c.key}>
                        <h6>${c.name}</h6>
                        <p class="${styles.card_data}">${d.data[c.key]}</p>
                      </div>`
              ) : ''}
            </div></div>
          </div></div>`.replaceAll(',', '');
        })
        .render();
    }
  }, [cardData, d3Container.current, shownColumns]);

  return (
    <div className="w-100 h-100">
      <div ref={d3Container} />
    </div>
  );
};

export default CustomPlugin;
