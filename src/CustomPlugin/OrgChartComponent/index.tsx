/* eslint-disable react-hooks/exhaustive-deps */
import React, { useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import modalStyles from '../../styles/Modal.module.scss';
import { OrgChartComponentProps } from '../../utils/Interfaces/CustomPlugin';
import { PLUGIN_ID } from '../../utils/constants';
import { BiExpandAlt } from 'react-icons/bi';
import pluginContext from '../../plugin-context';
import EditorFormatter from '../../components/Elements/formatter';
import { Table, TableView } from '../../utils/Interfaces/Table.interface';
import ReactDOMServer from 'react-dom/server';
import { getTableById, getRowsByIds, getLinkCellValue } from 'dtable-utils';
import '../../styles/FieldFormatter.scss';

const OrgChartComponent: React.FC<OrgChartComponentProps> = ({
  pluginPresets,
  appActiveState,
  cardData,
  shownColumns,
  downloadPdfRef,
}) => {
  const [cardHeight, setCardHeight] = useState<number>(0);
  const d3Container = useRef(null);
  let chart: OrgChart<unknown> | null = null;
  let showFieldNames = pluginPresets[appActiveState.activePresetIdx].settings?.show_field_names;
  let colIDs = shownColumns?.map((s) => s?.key);
  let cols = pluginPresets[appActiveState.activePresetIdx].settings?.columns || [];
  let extracols =
    appActiveState.activeTable?.columns.filter(
      (c) => !cols?.map((col) => col?.key).includes(c?.key)
    ) || [];
  let fields = [...cols, ...extracols] || appActiveState.activeTable?.columns;
  let fieldsIDs = fields?.map((f) => f?.key);
  let _shownColumns = fieldsIDs
    ?.map((id) => shownColumns?.find((c) => c?.key === id))
    .filter((c) => c !== undefined);

  const fitToScreen = () => {
    chart?.fit();
  };

  const downloadPdf = () => {
    if (chart) {
      chart.exportImg({ full: true });
    }
  };

  const getTableFormulaRows = (table: Table, view: TableView) => {
    const rows = window.dtableSDK.getViewRows(view, table);
    return window.dtableSDK.getTableFormulaResults(table, rows);
  };

  const onRowExpand = (r_id: string) => {
    let row = appActiveState.activeTable?.rows.find((row) => r_id === row._id);
    pluginContext.expandRow(row, appActiveState.activeTable);
  };

  const _getLinkCellValue = (linkId: string, table1Id: string, table2Id: string, rowId: string) => {
    const links = window.dtableSDK.getLinks();
    return getLinkCellValue(links, linkId, table1Id, table2Id, rowId);
  };

  const getRowsByID = (tableId: string, rowIds: any) => {
    const table = _getTableById(tableId);
    return getRowsByIds(table, rowIds);
  };

  const _getTableById = (table_id: string) => {
    const tables = window.dtableSDK.getTables();
    return getTableById(tables, table_id);
  };

  const getUserCommonInfo = (email: string, avatar_size: any) => {
    pluginContext.getUserCommonInfo(email, avatar_size);
  };

  const getMediaUrl = () => {
    return pluginContext.getSetting('mediaUrl');
  };

  const formulaRows = getTableFormulaRows(
    appActiveState.activeTable!,
    appActiveState.activeTableView!
  );
  const collaborators = window.app.state.collaborators;

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
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 250)
        .nodeHeight((d: d3.HierarchyNode<any>) => (cardHeight > 50 ? cardHeight + 10 : cardHeight))
        .createZoom(() => {
          return d3.zoom().filter((e) => {
            // Do not zoom on these elements, this is done to enable scrolling
            if (['DIV', 'FIGURE', 'H5', 'SPAN'].includes(e.srcElement.tagName)) {
              return false;
            }
            return true;
          });
        })
        .onNodeClick((d: any) => {
          onRowExpand(d.id);
        })
        .nodeContent((d: any, i: number, arr, state) => {
          let image =
            appActiveState.activeCoverImg &&
            colIDs?.includes(appActiveState.activeCoverImg.key) &&
            d.data[appActiveState.activeCoverImg.key] &&
            d.data[appActiveState.activeCoverImg.key][0];
          let titleCol = appActiveState.activeTable?.columns.find(
            (c) => c.key === appActiveState.activeCardTitle?.key
          );
          return `<div style="border:1px solid #dedede; border-radius: 5px;position: relative;background: #fff;margin: 0;width:${
            d.width
          }px;height:${d.height}px;">
                    <div style='position:relative; margin: 0;' class="org-card" >
                      ${
                        image
                          ? `<img class="card-img" src="${image}" style="width: 100%;
                          height: 180px;
                          margin-bottom: 10px;
                          object-fit: cover;
                          position:relative;
                          border-bottom: 1px solid #dedede;
                          top: 0;
                          left: 0;
                          " />`
                          : ''
                      }
                      <div style="padding: ${
                        !image ? '15px' : '0'
                      } 15px 0;font-size: 14px;margin: 5px 0 15px;font-weight: 600;">
                      ${ReactDOMServer.renderToString(
                        <EditorFormatter
                          column={titleCol}
                          row={d.data}
                          table={appActiveState.activeTable}
                          displayColumnName={false}
                          getLinkCellValue={_getLinkCellValue}
                          getTableById={_getTableById}
                          getRowsByID={getRowsByID}
                          selectedView={appActiveState.activeTableView}
                          collaborators={collaborators}
                          getUserCommonInfo={getUserCommonInfo}
                          getMediaUrl={getMediaUrl}
                          formulaRows={formulaRows}
                        />
                      )}
                      </div>
                      <div style="padding: 0 15px 10px;margin-top: 10px;max-height: 195px;
                      overflow: auto; gap: 15px;
                      display: flex;
                      flex-direction: column;" class="org-card-formatter">
                        ${
                          _shownColumns
                            ? _shownColumns?.map(
                                (c: any, i) =>
                                  `<div>
                            ${ReactDOMServer.renderToString(
                              <EditorFormatter
                                column={c}
                                row={d.data}
                                table={appActiveState.activeTable}
                                displayColumnName={showFieldNames || false}
                                getLinkCellValue={_getLinkCellValue}
                                getTableById={_getTableById}
                                getRowsByID={getRowsByID}
                                selectedView={appActiveState.activeTableView}
                                collaborators={collaborators}
                                getUserCommonInfo={getUserCommonInfo}
                                getMediaUrl={getMediaUrl}
                                formulaRows={formulaRows}
                              />
                            )}
                            </div>`
                              )
                            : ''
                        }
                </div></div>
              </div>`.replaceAll(',', '');
        })
        .nodeUpdate((d: any) => {
          chart?.duration(500);

          let org_cards = Array.from(document.querySelectorAll('.org-card'));
          let org_card_height = org_cards
            .map((card: any) => card.clientHeight)
            .reduce((a: any, b: any) => Math.max(a, b));
          setCardHeight(org_card_height);
        })
        .render();
    }

    // to reset state on unmount
    return () => {
      if (chart) {
        chart.clear();
      }
    };
  }, [cardData, d3Container.current, shownColumns, cardHeight]);

  return (
    // Add your JSX code here
    <div className="w-100 h-100" id={PLUGIN_ID}>
      <button onClick={fitToScreen} className={modalStyles.main_fit_to_screen}>
        <BiExpandAlt color="#fff" />
      </button>
      <button onClick={downloadPdf} ref={downloadPdfRef} style={{ display: 'none' }}>
        Download PDF
      </button>
      <div ref={d3Container} />
    </div>
  );
};

export default OrgChartComponent;
