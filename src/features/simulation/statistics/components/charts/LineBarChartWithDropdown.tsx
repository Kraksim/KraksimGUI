import { MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

import { LineBarChart } from './LineBarChart';
import { Series } from './types';

interface Props{
  dropdownValues: number[],
  barSeriesByEntity: Array<Map<number, Series>>,
  lineSeriesByEntity: Array<Map<number, Series>>,
  height: number,
  barWidth: number,
  roadNames: Record<number, string>,
  title: string,
}

export default function LineBarChartWithDropdown({
  dropdownValues, barSeriesByEntity, lineSeriesByEntity, height, barWidth, roadNames, title,
}: Props,
): JSX.Element {
  const [selectedElement, setSelectedElement] = useState('');

  const parsedSelectedElement = parseInt(selectedElement);
  const barSeries = barSeriesByEntity.filter(map => map.has(parsedSelectedElement))
    .map(map => map.get(parsedSelectedElement)) as Series[];

  const lineSeries = lineSeriesByEntity.filter(map => map.has(parsedSelectedElement))
    .map(map => map.get(parsedSelectedElement)) as Series[];

  return (
      <div>
          <Select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
              {dropdownValues.map(item => <MenuItem key={item} value={item}>{roadNames[item]}</MenuItem>)}
          </Select>
          <div>
            <LineBarChart 
            title={title}
            lineSeries={lineSeries}
            barSeries={barSeries}
            height={height} 
            barWidth={barWidth}
            />
          </div>
      </div>
  );

}