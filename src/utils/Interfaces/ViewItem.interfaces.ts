export interface IViewItemProps {
  allViews: any[],
  currentViewIdx: number,
  onSelectView: (viewId: string) => void,
  toggleNewViewPopUp: (e, type?: 'edit') => void,
  deleteView: () => void,
  v: any;
  viewName: string,
  onViewNameChange: (e:React.FormEvent<HTMLInputElement>) => void ,
  onEditViewSubmit: (e, type?: 'edit') => void,
  duplicateView: (name: string) => void,
  showEditViewPopUp: boolean
}

export interface IViewItemState {
  showViewDropdown: boolean,
  isEditing: boolean
}