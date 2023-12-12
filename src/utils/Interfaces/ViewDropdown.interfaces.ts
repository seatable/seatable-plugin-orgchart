export interface IViewDropdownProps {
  deleteView: () => void;
  toggleEditViewPopUp: (e) => void,
  duplicateView: () => void,
  dropdownRef: React.RefObject<HTMLUListElement>  | undefined
}

export interface IViewDropdownState {
  showViewDropdown: boolean,
}
