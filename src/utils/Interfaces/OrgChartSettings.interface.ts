export interface IOrgChartSettingsProps {
    columns: any[],
    toggleSettings: () => void,
    subtables: any[],
    currentTable: any,
    shownColumns: any[],
    currentView: any;
    onTablechange: (id: string) => void,
    handleShownColumn: (e: React.FormEvent<HTMLInputElement>) => void,
    updateColumnFieldOrder: (shownColumns: any, _columns: any) => void
}

export interface IOrgChartSettingsState {
    dragItemIndex: number | null,
    dragOverItemIndex: number | null,
    _columns: any[]

}