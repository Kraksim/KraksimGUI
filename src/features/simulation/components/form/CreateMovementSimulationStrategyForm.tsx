import React from 'react';
import { FastField, ErrorMessage, FieldProps } from 'formik';
import { Box, InputLabel, MenuItem } from '@mui/material';

import { MovementSimulationStrategyType } from '../../types';

import { FormBox, FormInpiutField, ElementBox, FormSelect } from './common';

export const movementSimulationStrategyInitialValues = {
  type: '',
  randomProvider: '',
  slowDownProbability: '',
  maxVelocity: '',
};

interface Props {
  compatibleStrategies: MovementSimulationStrategyType[];
}

const labels: Map<MovementSimulationStrategyType, string> = new Map([
  ['NAGEL_SCHRECKENBERG', 'Nagel Schreckenberg'],
  ['MULTI_LANE_NAGEL_SCHRECKENBERG', 'Multi Lane Nagel'],
]);

function CreateMovementSimulationStrategyForm({
  compatibleStrategies,
}: Props): JSX.Element {
  return (
    <div>
      <h1>Movement Simulation Strategy</h1>
      <FormBox>
        <ElementBox></ElementBox>
        <ElementBox>
          <Box>
            <InputLabel htmlFor={'movementSimulationStrategy.type'}>
              Strategy Type
            </InputLabel>
            <FastField name={'movementSimulationStrategy.type'} type="number">
              {({ field }: FieldProps) => (
                <FormSelect {...field} label="Strategy Type">
                  {compatibleStrategies.map((type) => (
                    <MenuItem value={type}>{labels.get(type)}</MenuItem>
                  ))}
                </FormSelect>
              )}
            </FastField>
            <ErrorMessage
              name={'movementSimulationStrategy.type'}
              component="div"
            />
          </Box>
          <Box>
            <InputLabel htmlFor={'movementSimulationStrategy.maxVelocity'}>
              Max Velocity
            </InputLabel>
            <FastField
              name={'movementSimulationStrategy.maxVelocity'}
              type="number"
              placeholder="Max Velocity"
              as={FormInpiutField}
            />
            <ErrorMessage
              name={'movementSimulationStrategy.maxVelocity'}
              component="div"
              className="field-error"
            />
          </Box>
        </ElementBox>
        <ElementBox>
          <Box>
            <InputLabel htmlFor={'movementSimulationStrategy.randomProvider'}>
              Random Provider
            </InputLabel>
            <FastField
              name={'movementSimulationStrategy.randomProvider'}
              type="number"
            >
              {({ field }: FieldProps) => (
                <FormSelect {...field} label="Strategy Type">
                  <MenuItem value={'TRUE'}>True Random</MenuItem>
                </FormSelect>
              )}
            </FastField>
            <ErrorMessage
              name={'SimulationStrategy.randomProvider'}
              component="div"
            />
          </Box>
          <Box>
            <InputLabel
              htmlFor={'movementSimulationStrategy.slowDownProbability'}
            >
              Slow Down Probability (%)
            </InputLabel>
            <FastField
              name={'movementSimulationStrategy.slowDownProbability'}
              type="number"
              placeholder="Slow down probability (%)"
              as={FormInpiutField}
            />
            <ErrorMessage
              name={'movementSimulationStrategy.slowDownProbability'}
              component="div"
              className="field-error"
            />
          </Box>
        </ElementBox>
      </FormBox>
    </div>
  );
}

export default React.memo(CreateMovementSimulationStrategyForm);
