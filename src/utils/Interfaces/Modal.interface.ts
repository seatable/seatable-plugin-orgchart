export interface IModalProps {
subtables: any[],
  linkedRows: any,
  allViews: any[],
  currentTable: any,
  currentView: any,
  addNewView: (table: any, v_name: string) => void,
  toggle: () => void,
  shownColumns: any[],
  rows: any[],
  columns: any[],
  onTablechange: (id: string) => void,
  handleShownColumn: (e:React.FormEvent<HTMLInputElement>) => void 
}

export interface IModalState {
    showNewViewPopUp: boolean,
    viewName: string,
    showSettings: boolean
}