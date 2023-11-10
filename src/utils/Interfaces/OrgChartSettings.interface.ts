export interface IOrgChartSettingsProps {
    columns: any[],
    toggleSettings: () => void,
    subtables: any[],
    currentTable: any,
    shownColumns: any[],
    onTablechange: (id: string) => void,
    handleShownColumn: (e:React.FormEvent<HTMLInputElement>) => void 
}