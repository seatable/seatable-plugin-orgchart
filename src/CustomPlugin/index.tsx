/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import { IPresetInfo } from '../utils/Interfaces/PluginPresets/Presets.interface';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
  shownColumns,
}) => {
  const [cardData, setCardData] = useState<any[]>(); // row (card) data
  useEffect(() => {
    d3.csv('https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv').then(
      (data) => {
        setCardData(data);
      }
    );
  }, []);

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
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 200)
        .nodeHeight((d: d3.HierarchyNode<unknown>) => 120)
        .onNodeClick((d: d3.HierarchyNode<unknown>) => {
          console.log(d, 'Id of clicked node ');
        })
        .nodeContent(
          (d, i: number) =>
            `<div style="text-align: center; background: #fff; height: 100%; padding: 20px;"><h6>This is card ${++i}</h6></div>`
        )
        .render();
    }
  }, [cardData, d3Container.current]);

  return (
    <div className="w-100 h-100">
      <div ref={d3Container} />

      {pluginPresets.map((preset: IPresetInfo) => (
        <div
          key={preset._id}
          style={{
            border: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            borderRadius: '5px',
            backgroundColor: '#fff',
          }}>
          <div style={{ fontWeight: 'bold' }}>{`Preset ID: ${preset._id}`}</div>
          <div style={{ color: '#007bff' }}>{`Preset Name: ${preset.name}`}</div>
          <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Settings:</div>
          <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedTableId: ${
            preset.settings?.selectedTable?.label ?? 'N/A'
          }`}</div>
          <div style={{ marginLeft: '15px', color: '#28a745' }}>{`selectedViewId: ${
            preset.settings?.selectedView?.label ?? 'N/A'
          }`}</div>
        </div>
      ))}
      <div
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          backgroundColor: '#fff',
        }}>
        <div
          style={{
            color: '#ff6666',
          }}>{`Active Table: ${appActiveState.activeTableName}`}</div>
        <div
          style={{
            color: '#ff6666',
          }}>{`Active View: ${appActiveState?.activeTableView?.name}`}</div>
        <div
          style={{
            color: '#ff6666',
          }}>{`Active Title: ${appActiveState?.activeCardTitle?.name}`}</div>
        <div
          style={{
            color: '#ff6666',
          }}>{`Active Relationship: ${
          appActiveState?.activeRelationship?.name || 'No Relationship'
        }`}</div>
        <div
          style={{
            color: '#ff6666',
          }}>{`Active Cover Img: ${appActiveState?.activeCoverImg?.name || 'No Image'}`}</div>
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          backgroundColor: '#fff',
        }}>
        <p>Shown Columns</p>
        {shownColumns?.map((c) => (
          <div
            key={c.key}
            style={{
              color: '#000',
            }}>
            {c.name}
          </div>
        ))}
      </div>

      <div
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          backgroundColor: '#fff',
        }}>
        <div style={{ marginTop: '8px', fontWeight: 'bold' }}>Rows of this selection:</div>
        <div>
          {activeViewRows?.map(
            (row: {
              [x: string]:
                | boolean
                | React.ReactChild
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
              _id: React.Key | null | undefined;
            }) => (
              <div key={row._id}>
                <h6>{row['0000']}</h6>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPlugin;
