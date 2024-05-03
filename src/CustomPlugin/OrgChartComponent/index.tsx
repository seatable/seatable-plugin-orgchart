/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import deepCopy from 'deep-copy';
import { OrgChartComponentProps } from '../../utils/Interfaces/CustomPlugin';
import { PLUGIN_ID } from '../../utils/constants';
import pluginContext from '../../plugin-context';
import EditorFormatter from '../../components/Elements/formatter';
import { Table, TableView } from '../../utils/Interfaces/Table.interface';
import ReactDOMServer from 'react-dom/server';
import { getTableById, getRowsByIds, getLinkCellValue } from 'dtable-utils';
import '../../styles/FieldFormatter.scss';
import { arraysEqual } from '../../utils/utils';
import { OrgChartTreePosition } from '../../utils/Interfaces/PluginPresets/Presets.interface';

const OrgChartComponent: React.FC<OrgChartComponentProps> = ({
  pluginPresets,
  appActiveState,
  cardData,
  shownColumns,
  downloadPdfRef,
  pluginDataStore,
  updatePresets,
  fitToScreenRef,
  isDevelopment,
}) => {
  // Set the initial height of the card
  const [cardHeight, setCardHeight] = useState<number>(0);
  // Set the initial data of the tree
  const [__data, setData] = useState<any[]>([]);
  const [positioningAndZoomLevel, setPositioningAndZoomLevel] = useState<OrgChartTreePosition | {}>(
    {}
  );
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
    if (isDevelopment) return;
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
    let settings = {
      ...oldPreset?.settings,
      tree_data: __data,
      tree_position: positioningAndZoomLevel,
    };
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

  useEffect(() => {
    // Save tree data and positioning to the active preset when the user changes the preset
    if (_presetChanged !== appActiveState.activePresetId) {
      let _tree_data =
        pluginPresets.find((p) => p._id === _presetChanged)?.settings?.tree_data || [];
      let _tree_position =
        pluginPresets.find((p) => p._id === _presetChanged)?.settings?.tree_position || {};

      if (
        !arraysEqual(_tree_data, __data) ||
        !arraysEqual(positioningAndZoomLevel, _tree_position)
      ) {
        addTreeLeavesToPresets(_presetChanged);
      }

      setPresetChanged(appActiveState.activePresetId);
      setData([]);
      setPositioningAndZoomLevel({});
    }
  }, [_presetChanged, appActiveState.activePresetId]);

  // Render the chart
  useLayoutEffect(() => {
    let _tree_data = pluginPresets[appActiveState.activePresetIdx]?.settings?.tree_data;
    // logic to render updated data
    let DATA = _tree_data?.map((d) => {
      let p_d = cardData?.find((p) => p.id === d.id);
      return p_d ? { ...p_d, _expanded: d._expanded } : d;
    });

    if (cardData && d3Container.current) {
      if (!chart) {
        chart = new OrgChart();
      }

      chart
        .container(d3Container.current)
        .data(DATA[0] ? DATA : cardData)
        .svgHeight(window.innerHeight - 10)
        .compactMarginBetween((d) => 65)
        .compactMarginPair((d) => 100)
        .compact(false)
        .neighbourMargin((a, b) => 50)
        .siblingsMargin((d) => 20)
        .duration(0)
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 280)
        .nodeHeight((d: d3.HierarchyNode<any>) => cardHeight + 10)
        .onNodeClick((d: any) => {
          onRowExpand(d.id);
        })
        .onZoom(() => {
          let _transform = chart?.getChartState().lastTransform;
          if (_transform.x === 0 && _transform.y === 0 && _transform.k === 1) {
            _setPositioningAndZoomLevel(true);
          }
          setPositioningAndZoomLevel(chart?.getChartState().lastTransform || {});
        })
        .nodeContent((d: any, i: number, arr, state) => {
          let image =
            appActiveState.activeCoverImg &&
            d.data[appActiveState.activeCoverImg.key] &&
            d.data[appActiveState.activeCoverImg.key][0];

          // fallback image
          if (!image && appActiveState.activeCoverImg) {
            image = '/media/placeholder.png';
          }

          let titleCol = appActiveState.activeTable?.columns.find(
            (c) => c.key === appActiveState.activeCardTitle?.key
          );
          return `
            <div style="
              border:1px solid #dedede;
              border-radius: 5px;
              position: relative;
              background: #fff;
              margin: 0;
              width:${d.width}px; 
              height:${d.height}px;
            ">

            <!-- Card: Cover Image -->
            <div class="org-card" style="
              position:relative;
              margin: 0;
            ">
                ${
                  image
                    ? `<img class="card-img" src="${image}" style="width: 100%;
                    height: 180px;
                    object-fit: cover;
                    position:relative;
                    border-bottom: 1px solid #dedede;
                    top: 0;
                    left: 0;
                    " />`
                    : ''
                }
                
                <!-- Card: Title -->
                <div style="
                  padding: 15px;
                  font-size: 16px;
                  font-weight: 600;
                ">
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

                <!-- Card: other content -->
                <div class="org-card-formatter" style="
                  padding: 0 15px 10px;
                  font-size:14px;
                  gap: 15px;
                  display: flex;
                  flex-direction: column;" >
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

          if (i === arr.length - 1) {
            setData(chart?.data() || []);
          }
        })
        .render();
    }

    _setPositioningAndZoomLevel(true);

    return () => {
      if (chart) {
        chart.clear();
      }
    };
  }, [cardData, d3Container.current, cardHeight]);

  useEffect(() => {
    let __tree_data = pluginPresets[appActiveState.activePresetIdx].settings?.tree_data || [];
    let __tree_position =
      pluginPresets[appActiveState.activePresetIdx].settings?.tree_position || {};
    // Save tree data to the active preset when the user leaves the page
    const handleBeforeUnload = () => {
      if (arraysEqual(__data, __tree_data) && arraysEqual(__tree_position, positioningAndZoomLevel))
        return;
      addTreeLeavesToPresets(appActiveState.activePresetId);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [__data, positioningAndZoomLevel]);

  const _setPositioningAndZoomLevel = (def: boolean) => {
    // logic to render updated data
    let DATA = __data?.map((d) => {
      let p_d = cardData?.find((p) => p.id === d.id);
      return p_d ? { ...p_d, _expanded: d._expanded } : d;
    });
    let _gElement = document.querySelector('.chart');
    let preset_tree_position =
      pluginPresets[appActiveState.activePresetIdx].settings?.tree_position || {};
    DATA[0] && chart?.data(DATA).duration(0).render();

    if (
      Object.keys(positioningAndZoomLevel).length === 0 &&
      Object.keys(preset_tree_position).length !== 0 &&
      def
    ) {
      _gElement?.setAttribute(
        'transform',
        `translate(${preset_tree_position.x}, ${preset_tree_position.y}) scale(${preset_tree_position.k})`
      );
      setPositioningAndZoomLevel(preset_tree_position);
    } else if (Object.keys(positioningAndZoomLevel).length !== 0) {
      _gElement?.setAttribute(
        'transform',
        `translate(${positioningAndZoomLevel.x}, ${positioningAndZoomLevel.y}) scale(${positioningAndZoomLevel.k})`
      );
    } else {
      return;
    }
  };

  return (
    // Add your JSX code here
    <div className="w-100 h-100" id={PLUGIN_ID}>
      <button onClick={fitToScreen} ref={fitToScreenRef} style={{ display: 'none' }}>
        Fit to screen
      </button>
      <button onClick={downloadPdf} ref={downloadPdfRef} style={{ display: 'none' }}>
        Download PDF
      </button>
      <div ref={d3Container} />
    </div>
  );
};

export default OrgChartComponent;
