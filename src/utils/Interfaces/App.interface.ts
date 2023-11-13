export interface IAppProps {
    isDevelopment: boolean,
    showDialog: boolean,
    row: any
}

export interface IAppState {
    isLoading: boolean,
    showDialog: boolean,
    plugin_settings: {views: any},
    subtables: any[],
    linkedRows: any[],
    allViews: any[],
    currentView: any,
    currentTable: any,
    shownColumns: any[],
    _rows: any[],
    currentViewIdx: number;    
}