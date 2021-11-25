import { MenuItem } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import React, { useState } from 'react';

import LabeledInput from '../../../../page/home/dialogs/LabeledInput';

import { LineBarChart } from './LineBarChart';
import { Series } from './types';

interface Props {
  dropdownValues: number[];
  barSeriesByEntity: Array<Map<number, Series>>;
  lineSeriesByEntity: Array<Map<number, Series>>;
  height: number;
  barWidth: number;
  roadNames: Record<number, string>;
  title: string;
  isLoading: boolean;
  dropdownLabel: string;
  error?: FetchBaseQueryError | SerializedError;
  turn: number;
}

export default function LineBarChartWithDropdown({
  dropdownValues,
  barSeriesByEntity,
  lineSeriesByEntity,
  height,
  barWidth,
  roadNames,
  title,
  isLoading,
  dropdownLabel,
  error,
  turn,
}: Props): JSX.Element {
  const [selectedElement, setSelectedElement] = useState('');

  const parsedSelectedElement = parseInt(selectedElement);

  const barSeries = barSeriesByEntity
    .filter((map) => map.has(parsedSelectedElement))
    .map((map) => map.get(parsedSelectedElement)) as Series[];

  const lineSeries = lineSeriesByEntity
    .filter((map) => map.has(parsedSelectedElement))
    .map((map) => map.get(parsedSelectedElement)) as Series[];

  return (
    <div>
      <div>
        <LineBarChart
          turn={turn}
          renderSelect={
            <LabeledInput
              value={selectedElement}
              setValue={ setSelectedElement }
              label={dropdownLabel}
            >
              {dropdownValues.map((item) => (
                <MenuItem key={item} value={item}>
                  {roadNames[item]}
                </MenuItem>
              ))}
            </LabeledInput>
          }
          title={title}
          lineSeries={lineSeries}
          barSeries={barSeries}
          height={height}
          barWidth={barWidth}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
