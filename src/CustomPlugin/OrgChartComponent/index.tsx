/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import deepCopy from 'deep-copy';
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
import { arraysEqual, getTreeLeaves } from '../../utils/utils';

const OrgChartComponent: React.FC<OrgChartComponentProps> = ({
  pluginPresets,
  appActiveState,
  cardData,
  shownColumns,
  downloadPdfRef,
  pluginDataStore,
  updatePresets,
}) => {
  // Set the initial height of the card
  const [cardHeight, setCardHeight] = useState<number>(0);
  // Set the initial leaves of the tree (leaves are the nodes that have no children)
  const [leaves, setLeaves] = useState<any[]>([]);
  // Set the initial state of the presetId, to know when the user changes the preset
  const [_presetChanged, setPresetChanged] = useState<string>(appActiveState.activePresetId);
  // Set the ref for the d3 container
  const d3Container = useRef(null);
  // initialize the chart object
  let chart: OrgChart<unknown> | null = null;
  // Get boolean value of show_field_names
  let showFieldNames = pluginPresets[appActiveState.activePresetIdx].settings?.show_field_names;
  // Get the columns that are shown in the table
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

  // Function to fit the chart to the screen
  const fitToScreen = () => {
    chart?.fit();
  };

  // Function to download the chart as a PDF
  const downloadPdf = () => {
    if (chart) {
      chart.exportImg({ full: true });
    }
  };

  // Function to get the formula rows of the table
  const getTableFormulaRows = (table: Table, view: TableView) => {
    const rows = window.dtableSDK.getViewRows(view, table);
    return window.dtableSDK.getTableFormulaResults(table, rows);
  };

  // Function to expand the row in the table
  const onRowExpand = (r_id: string) => {
    let row = appActiveState.activeTable?.rows.find((row) => r_id === row._id);
    pluginContext.expandRow(row, appActiveState.activeTable);
  };

  // Function to get the link cell value
  const _getLinkCellValue = (linkId: string, table1Id: string, table2Id: string, rowId: string) => {
    const links = window.dtableSDK.getLinks();
    return getLinkCellValue(links, linkId, table1Id, table2Id, rowId);
  };

  // Function to get the rows by ID
  const getRowsByID = (tableId: string, rowIds: any) => {
    const table = _getTableById(tableId);
    return getRowsByIds(table, rowIds);
  };

  // Function to get the table by ID
  const _getTableById = (table_id: string) => {
    const tables = window.dtableSDK.getTables();
    return getTableById(tables, table_id);
  };

  // Function to get the user common info
  const getUserCommonInfo = (email: string, avatar_size: any) => {
    pluginContext.getUserCommonInfo(email, avatar_size);
  };

  // Function to get the media URL
  const getMediaUrl = () => {
    return pluginContext.getSetting('mediaUrl');
  };

  // Get the formula rows of the table
  const formulaRows = getTableFormulaRows(
    appActiveState.activeTable!,
    appActiveState.activeTableView!
  );

  // Get the collaborators
  const collaborators = window.app.state.collaborators;

  // Function to add tree leaves to the active preset
  const addTreeLeavesToPresets = (_id: string, leavess?: any) => {
    let newPluginPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets.find((p) => p._id === _id)!;
    let _idx = pluginPresets.findIndex((p) => p._id === _id);
    let settings = { ...oldPreset.settings, tree_leaves: leavess || leaves };
    let updatedPreset = { ...oldPreset, settings, _id: _id };

    newPluginPresets.splice(_idx, 1, updatedPreset);
    pluginDataStore.presets = newPluginPresets;

    updatePresets(
      appActiveState.activePresetIdx,
      newPluginPresets,
      pluginDataStore,
      appActiveState.activePresetId
    );
  };

  const setInitialTreeLayout = (leaves: any[], cardData?: any[]) => {
    if (leaves.length === 0) return;

    if (leaves.length === 1 && !cardData?.find((d) => d.id === leaves[0])?.parentId) {
      chart?.collapseAll(); // If leave is root, collapse all
    } else {
      leaves.map((leaf, i) => {
        if (i !== leaves.length - 1) {
          return chart?.duration(0).setExpanded(leaf, true).render(); // Expand all leaves
        } else {
          return chart
            ?.duration(0)
            .nodeUpdate((d, i, arr) => {
              let _leaves = getTreeLeaves(arr).map((l) => l?.__data__?.id);
              setLeaves(_leaves);
            })
            .setExpanded(leaf, true)
            .render();
        }
      });
    }
  };

  useEffect(() => {
    let _leaves = pluginPresets[appActiveState.activePresetIdx].settings?.tree_leaves || [];

    // Save tree leaves to the active preset when the user changes the preset
    if (_presetChanged !== appActiveState.activePresetId) {
      if (!arraysEqual(_leaves, leaves) && leaves.length > 0) {
        addTreeLeavesToPresets(_presetChanged);
      }
    }

    setPresetChanged(appActiveState.activePresetId);
    setLeaves([]);
  }, [_presetChanged, appActiveState.activePresetId]);

  // Render the chart
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
                          height: 120px;
                          margin-bottom: 10px;
                          object-fit: cover;
                          position:relative;
                          top: 0;
                          left: 0;
                          " />`
                          : ''
                      }
                      <div style="padding: ${
                        !image ? '15px' : '0'
                      } 15px 0;font-size: 14px;margin: 0 0 15px;font-weight: 600;">
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
        .nodeUpdate((d: any, i, arr) => {
          chart?.duration(500);
          // Update card height
          let org_cards = Array.from(document.querySelectorAll('.org-card'));
          let org_card_height = org_cards
            .map((card: any) => card.clientHeight)
            .reduce((a: any, b: any) => Math.max(a, b));
          setCardHeight(org_card_height);

          // Update tree leaves
          let _leaves = getTreeLeaves(arr).map((l) => l?.__data__?.id);

          if (i === arr.length - 1 && !arraysEqual(_leaves, leaves)) {
            setLeaves(_leaves);
          }
        })
        .render();
    }

    let __leaves = pluginPresets[appActiveState.activePresetIdx].settings?.tree_leaves || [];

    if (leaves.length === 0 || arraysEqual(__leaves, leaves)) {
      setInitialTreeLayout(__leaves, cardData);
    } else {
      setInitialTreeLayout(leaves, cardData);
    }

    return () => {
      if (chart) {
        chart.clear();
      }
    };
  }, [cardData, d3Container.current, cardHeight]);

  useEffect(() => {
    let __leaves = pluginPresets[appActiveState.activePresetIdx].settings?.tree_leaves || [];
    // Save tree leaves to the active preset when the user leaves the page
    const handleBeforeUnload = () => {
      localStorage.setItem('leaves', JSON.stringify(leaves));
      if (arraysEqual(leaves, __leaves) || leaves.length === 0) return;
      addTreeLeavesToPresets(appActiveState.activePresetId);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [leaves]);

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
