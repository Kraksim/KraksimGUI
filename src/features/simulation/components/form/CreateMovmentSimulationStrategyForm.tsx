import React from 'react';
import { FastField, ErrorMessage, FieldProps } from 'formik';
import { Box, InputLabel, MenuItem } from '@mui/material';

import { FormBox, FormInpiutField, ElementBox, FormSelect } from './common';

export const movmentSimulationStrategyInitialValues = {
  type: '',
  randomProvider: '',
  slowDownProbability: '',
  maxVelocity: '',
};

function CreateMovmentSimulationStrategyForm(): JSX.Element {
  return (
    <div>
      <h1>Movment Simulation Strategy</h1>
      <>
        <FormBox>
          <ElementBox></ElementBox>
          <ElementBox>
            <Box>
              <InputLabel htmlFor={'movmentSimulationStrategy.type'}>
                Strategy Type
              </InputLabel>
              <FastField name={'movmentSimulationStrategy.type'} type="number">
                {({ field }: FieldProps) => (
                  <FormSelect {...field} label="Strategy Type">
                    <MenuItem value={'NAGEL_SCHRECKENBERG'}>
                      Nagel Schreckenberg
                    </MenuItem>
                    <MenuItem value={'MULTI_LANE_NAGEL_SCHRECKENBERG'}>
                      Multi Lane Nagel
                    </MenuItem>
                  </FormSelect>
                )}
              </FastField>
              <ErrorMessage
                name={'movmentSimulationStrategy.type'}
                component="div"
              />
            </Box>
            <Box>
              <InputLabel htmlFor={'movmentSimulationStrategy.maxVelocity'}>
                Max Velocity
              </InputLabel>
              <FastField
                name={'movmentSimulationStrategy.maxVelocity'}
                type="number"
                placeholder="Max Velocity"
                as={FormInpiutField}
              />
              <ErrorMessage
                name={'movmentSimulationStrategy.maxVelocity'}
                component="div"
                className="field-error"
              />
            </Box>
          </ElementBox>
          <ElementBox>
            <Box>
              <InputLabel htmlFor={'movmentSimulationStrategy.randomProvider'}>
                Random Provider
              </InputLabel>
              <FastField
                name={'movmentSimulationStrategy.randomProvider'}
                type="number"
              >
                {({ field }: FieldProps) => (
                  <FormSelect {...field} label="Strategy Type">
                    <MenuItem value={'TRUE'}>True Random</MenuItem>
                  </FormSelect>
                )}
              </FastField>
              <ErrorMessage
                name={'movmentSimulationStrategy.randomProvider'}
                component="div"
              />
            </Box>
            <Box>
              <InputLabel
                htmlFor={'movmentSimulationStrategy.slowDownProbability'}
              >
                Slow Down Probability (%)
              </InputLabel>
              <FastField
                name={'movmentSimulationStrategy.slowDownProbability'}
                type="number"
                placeholder="Slow down probability (%)"
                as={FormInpiutField}
              />
              <ErrorMessage
                name={'movmentSimulationStrategy.slowDownProbability'}
                component="div"
                className="field-error"
              />
            </Box>
          </ElementBox>
        </FormBox>
      </>
    </div>
  );
}

export default React.memo(CreateMovmentSimulationStrategyForm);
