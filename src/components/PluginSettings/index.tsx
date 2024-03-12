import React, { useEffect, useState } from 'react';
import DtableSelect from '../Elements/dtable-select';
import styles from '../../styles/PluginSettings.module.scss';
import styles2 from '../../styles/Presets.module.scss';
import deepCopy from 'deep-copy';
import {
  SelectOption,
  IPluginSettingsProps,
} from '../../utils/Interfaces/PluginSettings.interface';
import { truncateTableName } from '../../utils/utils';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
import { SettingsOption } from '../../utils/types';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '../../locale';
const { [DEFAULT_LOCALE]: d } = AVAILABLE_LOCALES;

// PluginSettings component for managing table and view options
const PluginSettings: React.FC<IPluginSettingsProps> = ({
  allTables,
  appActiveState,
  activeTableViews,
  isShowSettings,
  onToggleSettings,
  onTableOrViewChange,
  pluginPresets,
  activePresetIdx,
  pluginDataStore,
  updatePresets
}) => {
  // State variables for table and view options
  const [tableOptions, setTableOptions] = useState<SelectOption[]>();
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [tableSelectedOption, setTableSelectedOption] = useState<SelectOption>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();
  const [relationshipOptions, setRelationshipOptions] = useState<SelectOption[]>(); 
  const [relationshipSelectedOption, setRelationshipSelectedOption] = useState<SelectOption>(); 

  // Change options when active table or view changes
  useEffect(() => {
    const { activeTableView, activeTable } = appActiveState;

    // Create options for tables
    let tableOptions = allTables.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    // Create options for views
    let viewOptions = activeTableViews.map((item) => {
      let value = item._id;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    // Create options for relationship dropdown
    let relationshipOptions = activeTable?.columns.filter((item) => item.type === 'link').map((item) => {
      let value = item.key;
      let label = truncateTableName(item.name);
      return { value, label };
    });

    // Set selected options based on activeTable and activeTableView
    let tableSelectedOption = {
      value: appActiveState?.activeTable?._id!,
      label: appActiveState.activeTableName,
    };
    let viewSelectedOption = viewOptions.find((item) => item.value === activeTableView?._id);
    let relationshipSelectedOption = relationshipOptions?.find(item => item.value === appActiveState.activeRelationship?.key);

    // Update state with new options and selected values
    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
    setRelationshipOptions(relationshipOptions);
    setRelationshipSelectedOption(relationshipSelectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActiveState]);

  // Onchange function to update relationship value in preset settings
  const editRelationship = (selectedOption: SelectOption) => {
    let newPluginPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets[activePresetIdx];
    let relationship = appActiveState.activeTable?.columns.find((c) => c.key === selectedOption.value);
    let settings = {...oldPreset.settings, relationship: relationship};
    let updatedPreset = {...oldPreset, settings};


    newPluginPresets.splice(activePresetIdx, 1, updatedPreset);
    pluginDataStore.presets = newPluginPresets;

    updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, oldPreset._id);
  };

  return (
    <div className={`bg-white ${isShowSettings ? styles.settings : styles.settings_hide}`}>
      <div className="p-5">
        <div
          className={`d-flex align-items-center justify-content-between ${styles.settings_header}`}>
          <h4 className="m-0">{intl.get('settings_headline').d(`${d.settings_headline}`)}</h4>
          <button className={styles2.presets_uncollapse_btn2_settings} onClick={onToggleSettings}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div>
          <div className={styles.settings_dropdowns}>
            <div>
              <p className="d-inline-block mb-2">{intl.get('table').d(`${d.table}`)}</p>
              {/* Toggle table view */}
              <DtableSelect
                value={tableSelectedOption}
                options={tableOptions}
                onChange={(selectedOption: SelectOption) => {
                  let type = 'table' as SettingsOption;
                  onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>

            <div>
              <p className="d-inline-block mb-2 mt-3">{intl.get('view').d(`${d.view}/`)}</p>
              {/* Toggle table view */}
              <DtableSelect
                value={viewSelectedOption}
                options={viewOptions}
                onChange={(selectedOption: SelectOption) => {
                  let type = 'view' as SettingsOption;
                  onTableOrViewChange(type, selectedOption);
                }}
              />
            </div>
          </div>

          {/* custom settings */}
          <div className={styles.settings_dropdowns_noborder}>
            <div className='mt-3'>
              <p className="d-inline-block mb-2">Relationship</p>
              {/* Toggle relationship value */}
              <DtableSelect
                value={relationshipSelectedOption}
                options={relationshipOptions}
                onChange={editRelationship}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginSettings;
