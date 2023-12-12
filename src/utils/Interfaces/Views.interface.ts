import { SETTING_KEY } from '../../constants';

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
    updateViews: (currentIdx, views, plugin_settings) => void;
    plugin_settings: {views: any, [SETTING_KEY.VIEW_NAME]: any},
    showNewViewPopUp: boolean,
    showEditViewPopUp: boolean
}

export interface IViewsState {
    dragItemIndex: number | null,
    dragOverItemIndex: number | null,
    _allViews: any[]

}

