import { PLUGIN_NAME } from '../../constants';
import { AppActiveState, IPluginDataStore } from '../App.interface';
import { SelectOption } from '../PluginSettings.interface';
import { TableArray, TableColumn } from '../Table.interface';

export interface IPresetsProps {
  pluginPresets: PresetsArray;
  activePresetIdx: number;
  onSelectPreset: (presetId: string, newPresetActiveState?: AppActiveState) => void;
  updatePresets: (
    currentIdx: number,
    presets: PresetsArray,
    _pluginDataStore: IPluginDataStore,
    type: string
  ) => void;
  pluginDataStore: IPluginDataStore;
  isShowPresets: boolean;
  allTables: TableArray;
  onTogglePresets: (e: any) => void;
  onToggleSettings: (e: any) => void;
  updateActiveData: () => void;
}

export interface IPresetsState {
  dragItemIndex: number | null;
  dragOverItemIndex: number | null;
  _allViews: any[];
}

export interface IPresetInfo {
  _id: string;
  name: string;
  settings?: PresetSettings;
}

export interface OrgChartTreePosition {
  x: number;
  y: number;
  k: number
}

export interface PresetSettings {
  shown_image_name?: string | undefined;
  shown_title_name?: string | undefined;
  selectedTable?: SelectOption;
  selectedView?: SelectOption;
  title?: TableColumn;
  relationship?: TableColumn;
  coverImg?: TableColumn;
  shown_columns?: TableColumn[];
  show_field_names?: boolean;
  columns?: TableColumn[];
  tree_data?: any[];
  tree_position?: OrgChartTreePosition | {};
}

export type PresetsArray = IPresetInfo[];
