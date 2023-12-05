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
    allViews: any[]
}

export interface IOrgChartSettingsState {
    dragItemIndex: number | null,
    dragOverItemIndex: number | null,
    _columns: any[]

}