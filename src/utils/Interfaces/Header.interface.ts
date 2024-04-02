export interface IHeaderProps {
  presetName: string | undefined;
  isShowSettings: boolean;
  isShowPresets: boolean;
  downloadPdfRef: React.MutableRefObject<any>;
  toggleSettings: () => void;
  togglePlugin: () => void;
  onTogglePresets: () => void;
}
