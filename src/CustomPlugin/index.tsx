/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import '../styles/OrgChartCard.module.scss';
import { parseRowsData } from '../utils/utils';
import OrgChartComponent from './OrgChartComponent';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  shownColumns,
  downloadPdfRef,
  pluginDataStore,
  updatePresets,
}) => {
  const [cardData, setCardData] = useState<any[]>();
  let multiFields = appActiveState.activeTable?.columns.filter((c) => c.type === 'multiple-select');
  let __shownColumns = shownColumns?.map((s) =>
    s?.type === 'multiple-select' ? multiFields?.find((_s) => s.key === _s.key) : s
  );

  useEffect(() => {
    let data = parseRowsData(
      appActiveState.activeTable,
      appActiveState.activeViewRows,
      appActiveState.activeRelationship
    );
    setCardData(data);
  }, [appActiveState]);

  return (
    <OrgChartComponent
      cardData={cardData}
      pluginPresets={pluginPresets}
      shownColumns={__shownColumns}
      appActiveState={appActiveState}
      downloadPdfRef={downloadPdfRef}
      pluginDataStore={pluginDataStore}
      updatePresets={updatePresets}
    />
  );
};

export default CustomPlugin;
