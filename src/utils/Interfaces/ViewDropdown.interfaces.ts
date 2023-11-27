export interface IViewDropdownProps {
  deleteView: () => void;
  toggleEditViewPopUp: (e) => void,
}

export interface IViewDropdownState {
  showViewDropdown: boolean,
}
