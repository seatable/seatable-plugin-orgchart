import { SettingsOption } from '../types';
import { AppActiveState, IPluginDataStore } from './App.interface';
import { PresetSettings, PresetsArray } from './PluginPresets/Presets.interface';
import { TableArray, TableViewArray } from './Table.interface';

interface IPluginSettingsProps {
  allTables: TableArray;
  appActiveState: AppActiveState;
  activeTableViews: TableViewArray;
  pluginPresets: PresetsArray;
  onTableOrViewChange: (type: SettingsOption, option: SelectOption) => void;
  onToggleSettings: (e: any) => void;
  isShowSettings: boolean;
  activePresetIdx: number;
  pluginDataStore: IPluginDataStore;
  updatePresets: (
    _activePresetIdx: number,
    updatedPresets: PresetsArray,
    pluginDataStore: IPluginDataStore,
    activePresetId: string,
    callBack?: any
  ) => void;
}

interface SelectOption {
  value: string; // item._id
  label: string; // item.name
}

interface IActivePresetSettings extends PresetSettings {
  activePresetId: string;
}

export type { IPluginSettingsProps, SelectOption, IActivePresetSettings };
