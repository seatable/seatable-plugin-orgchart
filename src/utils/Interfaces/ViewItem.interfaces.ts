export interface IViewItemProps {
  allViews: any[],
  currentViewIdx: number,
  onSelectView: (viewId: string) => void,
  toggleNewViewPopUp: (e, type?: 'edit') => void,
  deleteView: () => void,
  v: any;
}

export interface IViewItemState {
  showViewDropdown: boolean,
}