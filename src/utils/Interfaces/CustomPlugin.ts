import { AppActiveState } from './App.interface';
import { PresetsArray } from './PluginPresets/Presets.interface';
import { TableColumn, TableRow } from './Table.interface';

export interface ICustomPluginProps {
  pluginPresets: PresetsArray;
  appActiveState: AppActiveState;
  activeViewRows?: TableRow[];
  shownColumns?: TableColumn[];
}

export interface OrgChartComponentProps {
  // Add any props you need for your component here
  pluginPresets: PresetsArray;
  appActiveState: AppActiveState;
  shownColumns: TableColumn[] | undefined;
  cardData: any[] | undefined;
}