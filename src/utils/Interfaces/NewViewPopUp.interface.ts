export interface INewViewProps {
    viewName: string,
    onViewNameChange: (e:React.FormEvent<HTMLInputElement>) => void ,
    onNewViewSubmit?: (e, type?: 'edit') => void,
    onEditViewSubmit?: (e, type?: 'edit') => void,
    toggleNewViewPopUp: (e, type?: 'edit') => void,
    type?: 'edit'
}
    
