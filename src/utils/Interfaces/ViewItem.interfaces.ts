export interface IViewItemProps {
  allViews: any[],
  currentViewIdx: number,
  onSelectView: (viewId: string) => void,
  v: any;
}

export interface IViewItemState {
  showViewDropdown: boolean,
}