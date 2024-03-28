import { AppActiveState } from './App.interface';
import { PresetsArray } from './PluginPresets/Presets.interface';
import { TableColumn, TableRow } from './Table.interface';

export interface ICustomPluginProps {
  pluginPresets: PresetsArray;
  appActiveState: AppActiveState;
  activeViewRows?: TableRow[];
  shownColumns?: TableColumn[];
}
