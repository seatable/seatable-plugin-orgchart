export interface IHeaderProps {
  presetName: string | undefined;
  isShowSettings: boolean;
  isShowPresets: boolean;
  downloadPdfRef: React.MutableRefObject<any>;
  toggleSettings: (e: any) => void;
  togglePlugin: () => void;
  onTogglePresets: (e: any) => void;
}
