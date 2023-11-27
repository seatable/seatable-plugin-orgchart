export interface IModalProps {
subtables: any[],
  linkedRows: any,
  allViews: any[],
  currentTable: any,
  currentViewIdx: number,
  addNewView: (v_name: string) => void,
  editView: (v_name: string) => void,
  toggle: () => void,
  shownColumns: any[],
  rows: any[],
  columns: any[],
  onTablechange: (id: string) => void,
  handleShownColumn: (e:React.FormEvent<HTMLInputElement>) => void,
  onSelectView: (viewId: string) => void,
  deleteView: () => void;    
  updateColumnFieldOrder: (shownColumns: any, _columns: any) => void,
  onAddOrgChartItem : (view, table, rowID) => void,
  getTablePermissionType: () =>  void;
}

export interface IModalState {
    showNewViewPopUp: boolean,
    showEditViewPopUp: boolean,
    viewName: string,
    showSettings: boolean,
}