export interface IViewDropdownProps {
  deleteView: () => void;
  toggleEditViewPopUp: (e) => void,
  duplicateView: () => void,
}

export interface IViewDropdownState {
  showViewDropdown: boolean,
}
