export interface IModalProps {
subtables: any[],
  linkedRows: any,
  allViews: any[],
  currentTable: any,
  currentViewIdx: number,
  addNewView: (v_name: string) => void,
  toggle: () => void,
  shownColumns: any[],
  rows: any[],
  columns: any[],
  onTablechange: (id: string) => void,
  handleShownColumn: (e:React.FormEvent<HTMLInputElement>) => void,
  onSelectView: (viewId: string) => void,
  deleteView: () => void;
}

export interface IModalState {
    showNewViewPopUp: boolean,
    viewName: string,
    showSettings: boolean,
}