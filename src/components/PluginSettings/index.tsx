// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { COLUMNS_ICON_CONFIG } from 'dtable-utils';
import DtableSelect from '../Elements/dtable-select';
import styles from '../../styles/PluginSettings.module.scss';
import styles2 from '../../styles/Presets.module.scss';
import deepCopy from 'deep-copy';
import {
  SelectOption,
  IPluginSettingsProps,
} from '../../utils/Interfaces/PluginSettings.interface';
import {
  getImageColumns,
  getTitleColumns,
  truncateTableName,
  isAllColumnsShown,
  showFieldNames,
  checkIfLinkToDifferentTable,
  removeDeletedFields,
} from '../../utils/utils';
import { HiOutlineChevronDoubleRight } from 'react-icons/hi2';
import { SettingsOption } from '../../utils/types';
import intl from 'react-intl-universal';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '../../locale';
import { TableColumn } from '../../utils/Interfaces/Table.interface';
const { [DEFAULT_LOCALE]: d } = AVAILABLE_LOCALES;

const DropdownStyles = {
  gridArea: '1 / 1 / 2 / 3',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginLeft: '2px',
  marginRight: '2px',
  fontSize: '14px',
  cursor: 'pointer',
  lineHeight: '1.5',
  opacity: '1',
};

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
  updatePresets,
}) => {
  // State variables for table and view options
  const [tableOptions, setTableOptions] = useState<SelectOption[]>();
  const [viewOptions, setViewOptions] = useState<SelectOption[]>();
  const [tableSelectedOption, setTableSelectedOption] = useState<SelectOption>();
  const [viewSelectedOption, setViewSelectedOption] = useState<SelectOption>();
  const [titleOptions, setTitleOptions] = useState<SelectOption[]>();
  const [titleSelectedOption, setTitleSelectedOption] = useState<SelectOption>();
  const [relationshipOptions, setRelationshipOptions] = useState<SelectOption[]>();
  const [relationshipSelectedOption, setRelationshipSelectedOption] = useState<SelectOption>();
  const [coverImgOptions, setCoverImgOptions] = useState<SelectOption[]>();
  const [coverImgSelectedOption, setCoverImgSelectedOption] = useState<SelectOption>();
  const [dragItemIndex, setDragItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);
  const { activeTable } = appActiveState;
  let shownColumns = pluginPresets[activePresetIdx].settings?.shown_columns?.map((c) => c.key);
  let isAllShown = isAllColumnsShown(shownColumns, activeTable?.columns);
  let fields = pluginPresets[activePresetIdx].settings?.columns || activeTable?.columns;
  let extraFields = activeTable?.columns.filter(
    (c) => !fields?.map((f) => f?.key)?.includes(c?.key)
  );
  fields = removeDeletedFields([...fields, ...extraFields], appActiveState.activeTable!);

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

    // Create options for title dropdown
    let titleOptions = getTitleColumns(activeTable?.columns).map((item) => {
      let value = item.key;
      let label = (
        <p className={'d-flex align-items-center'} style={DropdownStyles}>
          <i
            className={`dtable-font mr-2 ${COLUMNS_ICON_CONFIG[item.type]} ${
              styles.settings_fields_icons
            }`}></i>
          <span>{truncateTableName(item.name)}</span>
        </p>
      );
      return { value, label };
    });

    // Create options for relationship dropdown
    //console.log(activeTable?.columns.filter((item) => item.type === 'link'));
    let relationshipOptions = activeTable?.columns
      .filter((item) => item.type === 'link')
      .filter((item) => !checkIfLinkToDifferentTable(item, appActiveState.activeTable!))
      .map((item) => {
        let value = item.key;
        let label = (
          <p className={'d-flex align-items-center'} style={DropdownStyles}>
            <i
              className={`dtable-font mr-2 ${COLUMNS_ICON_CONFIG[item.type]} ${
                styles.settings_fields_icons
              }`}></i>
            <span>{truncateTableName(item.name)}</span>
          </p>
        );
        return { value, label };
      });

    // Create options for title dropdown
    let coverImgOptions = [
      { value: '_0000', label: 'No Image' },
      ...getImageColumns(activeTable?.columns).map((item) => {
        let value = item.key;
        let label = (
          <p className={'d-flex align-items-center'} style={DropdownStyles}>
            <i
              className={`dtable-font mr-2 ${COLUMNS_ICON_CONFIG[item.type]} ${
                styles.settings_fields_icons
              }`}></i>
            <span>{truncateTableName(item.name)}</span>
          </p>
        );
        return { value, label };
      }),
    ];

    // Set selected options based on activeTable and activeTableView
    let tableSelectedOption = {
      value: appActiveState?.activeTable?._id!,
      label: appActiveState.activeTableName,
    };
    let viewSelectedOption = viewOptions.find((item) => item.value === activeTableView?._id);
    let titleSelectedOption = titleOptions?.find(
      (item) => item.value === appActiveState.activeCardTitle?.key
    );
    let relationshipSelectedOption = relationshipOptions?.find(
      (item) => item.value === appActiveState.activeRelationship?.key
    );
    let coverImgSelectedOption = coverImgOptions?.find(
      (item) => item.value === appActiveState.activeCoverImg?.key
    ) || { value: '_0000', label: 'No Image' };

    // Update state with new options and selected values
    setTableOptions(tableOptions);
    setTableSelectedOption(tableSelectedOption);
    setViewOptions(viewOptions);
    setViewSelectedOption(viewSelectedOption);
    setTitleOptions(titleOptions);
    setTitleSelectedOption(titleSelectedOption);
    setRelationshipOptions(relationshipOptions);
    setRelationshipSelectedOption(relationshipSelectedOption);
    setCoverImgOptions(coverImgOptions);
    setCoverImgSelectedOption(coverImgSelectedOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appActiveState]);

  // Onchange function to update title value in preset settings
  const editDropdowns = (selectedOption: SelectOption, option: string) => {
    let newPluginPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets[activePresetIdx];
    let col = appActiveState.activeTable?.columns.find((c) => c.key === selectedOption.value);
    let settings;
    if (option === 'title') {
      settings = { ...oldPreset.settings, title: col };
    } else if (option === 'relationship') {
      settings = { ...oldPreset.settings, relationship: col };
    } else {
      settings = { ...oldPreset.settings, coverImg: col };
    }

    let updatedPreset = { ...oldPreset, settings };

    newPluginPresets.splice(activePresetIdx, 1, updatedPreset);
    pluginDataStore.presets = newPluginPresets;

    updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, oldPreset._id);
  };

  const handleShownColumn = (
    c?: TableColumn,
    isPreviouslyChecked?: boolean,
    all?: 'show' | 'hide'
  ) => {
    let newPluginPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets[activePresetIdx];
    let shown_columns;

    if (all === 'show') {
      shown_columns = activeTable?.columns;
    } else if (all === 'hide') {
      shown_columns = [];
    } else if (!isPreviouslyChecked) {
      shown_columns = [...(oldPreset.settings?.shown_columns || []), c];
    } else {
      shown_columns = oldPreset.settings?.shown_columns?.filter((sc) => sc.key !== c?.key);
    }

    let settings = { ...oldPreset.settings, shown_columns };
    let updatedPreset = { ...oldPreset, settings };

    newPluginPresets.splice(activePresetIdx, 1, updatedPreset);
    pluginDataStore.presets = newPluginPresets;

    updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, oldPreset._id);
  };

  const handleShownFieldNames = (isShown: boolean) => {
    let newPluginPresets = deepCopy(pluginPresets);
    let oldPreset = pluginPresets[activePresetIdx];
    let show_field_names;

    if (isShown) {
      show_field_names = false;
    } else {
      show_field_names = true;
    }

    let settings = { ...oldPreset.settings, show_field_names };
    let updatedPreset = { ...oldPreset, settings };

    newPluginPresets.splice(activePresetIdx, 1, updatedPreset);
    pluginDataStore.presets = newPluginPresets;

    updatePresets(activePresetIdx, newPluginPresets, pluginDataStore, oldPreset._id);
  };

  // drag and drop logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDragItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();
    setDragOverItemIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    let __otherFields = [...fields!];
    if (dragItemIndex !== null && dragOverItemIndex !== null) {
      const dragItem = __otherFields.splice(dragItemIndex, 1)[0];
      __otherFields.splice(dragOverItemIndex, 0, dragItem);
      setDragItemIndex(null);
      setDragOverItemIndex(null);

      let _pluginPresets = [...pluginPresets];
      _pluginPresets[activePresetIdx].settings!.columns = __otherFields;
      let _pluginDataStore = { ...pluginDataStore, presets: _pluginPresets };

      updatePresets(
        appActiveState.activePresetIdx,
        _pluginPresets,
        _pluginDataStore,
        appActiveState.activePresetId
      );
    }
  };

  return (
    <div className={`bg-white ${isShowSettings ? styles.settings : styles.settings_hide}`}>
      <div>
        <div
          className={`d-flex align-items-center justify-content-between mx-5 pt-5 ${styles.settings_header}`}>
          <h4 className="m-0">{intl.get('settings_headline').d(`${d.settings_headline}`)}</h4>
          <button className={styles2.presets_uncollapse_btn2_settings} onClick={onToggleSettings}>
            <HiOutlineChevronDoubleRight />
          </button>
        </div>
        <div className={`px-5 ${styles.settings_inner_wrapper}`}>
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
                <p className="d-inline-block mb-2 mt-3">{intl.get('view').d(`${d.view}`)}</p>
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
          </div>

          {/* custom settings */}
          <div className={styles.settings_dropdowns_noborder}>
            <div className="mt-3">
              <p className="d-inline-block mb-2">
                {intl.get('relationship').d(`${d.relationship}`)}
              </p>
              {/* Toggle relationship value */}
              <DtableSelect
                value={relationshipSelectedOption}
                options={relationshipOptions}
                onChange={(v: SelectOption) => editDropdowns(v, 'relationship')}
              />
            </div>
            <div className="mt-3">
              <p className="d-inline-block mb-2">{intl.get('title').d(`${d.title}`)}</p>
              {/* Toggle title value */}
              <DtableSelect
                value={titleSelectedOption}
                options={titleOptions}
                onChange={(v: SelectOption) => editDropdowns(v, 'title')}
              />
            </div>
            <div className="mt-3">
              <p className="d-inline-block mb-2">{intl.get('cover_img').d(`${d.cover_img}`)}</p>
              {/* Toggle title value */}
              <DtableSelect
                value={coverImgSelectedOption}
                options={coverImgOptions}
                onChange={(v: SelectOption) => editDropdowns(v, 'coverImg')}
              />
              <div className={`mt-5 ${styles.settings_fields}`}>
                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <p>{intl.get('other_fields').d(`${d.other_fields}`)}</p>
                  <button
                    onClick={() =>
                      handleShownColumn(undefined, undefined, isAllShown ? 'hide' : 'show')
                    }
                    className={styles.settings_fields_show_all_btn}>
                    {isAllShown
                      ? intl.get('hide_all').d(`${d.hide_all}`)
                      : intl.get('show_all').d(`${d.show_all}`)}
                  </button>
                </div>
                {fields
                  .filter((c) => c !== null)
                  ?.map((c, i) => (
                    <div
                      key={c?.key}
                      className={styles.settings_fields_columns}
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragEnter={(e) => handleDragEnter(e, i)}
                      onDragEnd={(e) => handleDragEnd(e)}
                      onDragOver={handleDragOver}>
                      <div className="d-flex align-items-center">
                        <div className={`field-dragbar ${styles.settings_fields_dragbar}`}>
                          <i className="dtable-font dtable-icon-drag pr-2" />
                        </div>
                        <i
                          className={`${COLUMNS_ICON_CONFIG[c?.type]} ${
                            styles.settings_fields_icons
                          }`}
                        />
                        <p className="ml-2 mb-0">{c?.name}</p>
                      </div>
                      <button
                        onClick={() => handleShownColumn(c, shownColumns?.includes(c?.key)!)}
                        className={`${
                          shownColumns?.includes(c?.key)
                            ? styles.settings_fields_toggle_btns_active
                            : styles.settings_fields_toggle_btns
                        } `}></button>
                    </div>
                  ))}
              </div>
              <div className={`mt-5 ${styles.settings_fields}`}>
                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <p>{intl.get('show_field_names').d(`${d.show_field_names}`)}</p>
                  <button
                    onClick={() =>
                      handleShownFieldNames(
                        showFieldNames(pluginPresets[activePresetIdx].settings!)
                      )
                    }
                    className={`${
                      showFieldNames(pluginPresets[activePresetIdx].settings!)
                        ? styles.settings_fields_toggle_btns_active
                        : styles.settings_fields_toggle_btns
                    } `}></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginSettings;
