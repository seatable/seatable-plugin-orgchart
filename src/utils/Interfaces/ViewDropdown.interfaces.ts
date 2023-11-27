export interface IViewDropdownProps {
  deleteView: () => void;
  toggleEditViewPopUp: (e, v:string) => void,
}

export interface IViewDropdownState {
  showViewDropdown: boolean,
}
