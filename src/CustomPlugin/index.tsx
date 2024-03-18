import React from 'react';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import { IPresetInfo } from '../utils/Interfaces/PluginPresets/Presets.interface';
import { showFieldNames } from '../utils/utils';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
  shownColumns,
}) => (
  <>
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

      <div
        style={{
          color: '#ff6666',
        }}>
        {`Field names shown: ${showFieldNames(
          pluginPresets[appActiveState.activePresetIdx].settings!
        )}`}{' '}
      </div>
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
  </>
);

export default CustomPlugin;
