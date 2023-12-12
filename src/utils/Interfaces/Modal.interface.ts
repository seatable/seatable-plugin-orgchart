import React from 'react';
import { SETTING_KEY } from '../../constants';

export interface IModalProps {
  subtables: any[],
  linkedRows: any,
  allViews: any[],
  currentTable: any,
  currentViewIdx: number,
  addNewView: (v_name: string) => void,
  editView: (v_name: string) => void,
  toggle: () => void,
  shownColumns: any[],
  rows: any[],
  columns: any[],
  onTablechange: (id: string) => void,
  handleShownColumn: (val: string, checked: boolean) => void,
  onSelectView: (viewId: string) => void,
  deleteView: () => void;
  updateColumnFieldOrder: (shownColumns: any, _columns: any) => void,
  onAddOrgChartItem: (view, table, rowID) => void,
  getTablePermissionType: () => void;
  duplicateView: (name: string) => void,
  baseViews: any[],
  currentBaseView: any,
  updateBaseView: (pluginSettings) => void,
  updateViews: (currentIdx, views, plugin_settings) => void;
  plugin_settings: { views: any, [SETTING_KEY.VIEW_NAME]: any }
}

export interface IModalState {
  showNewViewPopUp: boolean,
  showEditViewPopUp: boolean,
  viewName: string,
  showSettings: boolean,
  popupRef: React.RefObject<HTMLDivElement>  | undefined
}