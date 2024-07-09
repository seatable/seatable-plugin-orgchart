export interface IHeaderProps {
  presetName: string | undefined;
  isShowSettings: boolean;
  isShowPresets: boolean;
  downloadPdfRef: React.MutableRefObject<any>;
  toggleSettings: (e: any) => void;
  fitToScreenRef: React.MutableRefObject<any>;
  togglePlugin: () => void;
  onTogglePresets: (e: any) => void;
}
