import { MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

import { LineBarChart } from './LineBarChart';
import { Series } from './types';

interface Props{
  dropdownValues: number[],
  barSeriesByEntity: Map<number, Series>,
  lineSeriesByEntity: Map<number, Series>,
  height: number,
  barWidth: number,
}

export default function LineBarChartWithDropdown({
  dropdownValues, barSeriesByEntity, lineSeriesByEntity, height, barWidth, 
}: Props,
): JSX.Element {
  const [selectedElement, setSelectedElement] = useState('');

  const barSeries = barSeriesByEntity.get(parseInt(selectedElement));
  const lineSeries = lineSeriesByEntity.get(parseInt(selectedElement));

  return (
      <div>
          <Select value={selectedElement} onChange={(e) => setSelectedElement(e.target.value)}>
              {dropdownValues.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
          </Select>
          <div>
            {
              (barSeries &&
              lineSeries) ?
            <LineBarChart 
            lineSeries={lineSeries ? [lineSeries] : []}
            barSeries={barSeries ? [barSeries] : []}
            height={height} 
            barWidth={barWidth}
            /> : <div>Select a element to display data</div>
            }
          </div>
      </div>
  );

}