export interface IViewsProps {
    allViews: any[],
    currentViewIdx: number,
    onSelectView: (viewId: string) => void,
    deleteView: () => void;
    toggleNewViewPopUp: (e, type?: 'edit') => void,
    viewName: string,
    onViewNameChange: (e:React.FormEvent<HTMLInputElement>) => void ,
    onNewViewSubmit?: (e, type?: 'edit') => void,
    onEditViewSubmit: (e, type?: 'edit') => void,
    duplicateView: (name: string) => void,
    showNewViewPopUp: boolean,
    showEditViewPopUp: boolean
}

