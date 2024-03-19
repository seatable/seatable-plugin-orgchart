/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ICustomPluginProps } from '../utils/Interfaces/CustomPlugin';
import { IPresetInfo } from '../utils/Interfaces/PluginPresets/Presets.interface';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';

const CustomPlugin: React.FC<ICustomPluginProps> = ({
  pluginPresets,
  appActiveState,
  activeViewRows,
  shownColumns,
}) => {
  const [cardData, setCardData] = useState<any[]>(); // row (card) data
  useEffect(() => {
    d3.csv('https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv').then(
      (data) => {
        setCardData(data);
      }
    );
  }, []);

  const d3Container = useRef(null);
  let chart: OrgChart<unknown> | null = null;

  // DOM Manipulation
  useLayoutEffect(() => {
    if (cardData && d3Container.current) {
      if (!chart) {
        chart = new OrgChart();
      }
      chart
        .container(d3Container.current)
        .data(cardData)
        .nodeWidth((d: d3.HierarchyNode<unknown>) => 200)
        .nodeHeight((d: d3.HierarchyNode<unknown>) => 120)
        .onNodeClick((d: d3.HierarchyNode<unknown>) => {
          console.log(d, 'Id of clicked node ');
        })
        .nodeContent(
          (d, i: number) =>
            `<div style="text-align: center; background: #fff; height: 100%; padding: 20px;"><h6>This is card ${++i}</h6></div>`
        )
        .render();
    }
  }, [cardData, d3Container.current]);

  return (
    <div className="w-100 h-100">
      <div ref={d3Container} />
    </div>
  );
};

export default CustomPlugin;
