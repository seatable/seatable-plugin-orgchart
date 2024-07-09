import { AppActiveState, IPluginDataStore } from './App.interface';
import { PresetsArray } from './PluginPresets/Presets.interface';
import { TableColumn, TableRow } from './Table.interface';

export interface ICustomPluginProps {
  pluginPresets: PresetsArray;
  appActiveState: AppActiveState;
  activeViewRows?: TableRow[];
  shownColumns?: (TableColumn | undefined)[];
  downloadPdfRef: React.MutableRefObject<null>;
  pluginDataStore: IPluginDataStore;
  updatePresets: (
    _activePresetIdx: number,
    updatedPresets: PresetsArray,
    pluginDataStore: IPluginDataStore,
    activePresetId: string,
    callBack?: any
  ) => void;
  fitToScreenRef: React.MutableRefObject<null>;
  isDevelopment?: boolean;
}

export interface OrgChartComponentProps extends ICustomPluginProps {
  cardData: any[] | undefined;
}
