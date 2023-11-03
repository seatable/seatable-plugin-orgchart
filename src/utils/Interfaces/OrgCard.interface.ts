export interface IOrgCardProps {
    currentTable: any,
    columns: any[],
    row: any,
    linkedRows: any,
    shownColumns: any[]
}

export interface IOrgCardState {
    collapsedCharts: string[]
}