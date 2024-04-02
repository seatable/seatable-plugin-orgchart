/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import '../styles/OrgChartCard.module.scss';
import { parseRowsData } from '../utils/utils';
import OrgChartComponent from './OrgChartComponent';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
  shownColumns,
}) => {
  const [cardData, setCardData] = useState<any[]>();

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
      shownColumns={shownColumns}
      appActiveState={appActiveState}
    />
  );
};

export default CustomPlugin;
