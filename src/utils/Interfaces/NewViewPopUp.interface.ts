export interface INewViewProps {
    viewName: string,
    onViewNameChange: (e:React.FormEvent<HTMLInputElement>) => void ,
    onNewViewSubmit: () => void,
    toggleNewViewPopUp: () => void
}
    
