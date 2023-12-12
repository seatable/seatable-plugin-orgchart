import { SETTING_KEY } from '../../constants';

export interface IOrgChartSettingsProps {
    columns: any[],
    toggleSettings: () => void,
    subtables: any[],
    currentTable: any,
    shownColumns: any[],
    currentView: any;
    onTablechange: (id: string) => void,
    handleShownColumn: (val: string, checked: boolean) => void,
    updateColumnFieldOrder: (shownColumns: any, _columns: any) => void,
    onSelectView: (viewId: string) => void,
    allViews: any[],
    baseViews: any[],
    currentBaseView: any,
    updateBaseView: (pluginSettings) => void,
    plugin_settings: {views: any, [SETTING_KEY.VIEW_NAME]: any},
    settingsRef: React.RefObject<HTMLDivElement>  | undefined
}

export interface IOrgChartSettingsState {
    dragItemIndex: number | null,
    dragOverItemIndex: number | null,
    _columns: any[]
}