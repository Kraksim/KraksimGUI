import React from 'react';
import {
  FastField, ErrorMessage, FieldProps,
} from 'formik';
import {
  Box, InputLabel, MenuItem,
} from '@mui/material';

import { MovementSimulationStrategyType } from '../../types';
import { labelMovementStrategy } from '../../../common/labels';

import {
  FormBox, FormInpiutField, ElementBox, FormSelect,
} from './common';

type InitialValues = {
  type: string,
  slowDownProbability: string,
  maxVelocity: string,
  threshold?: string,
  accelerationDelayProbability?: string,
  breakLightReactionProbability?: string
};

export const movementSimulationStrategyInitialValues: InitialValues = {
  type: 'NAGEL_SCHRECKENBERG',
  slowDownProbability: '',
  maxVelocity: '',
};

interface Props {
  compatibleStrategies: MovementSimulationStrategyType[],
  values: InitialValues;
}



function CreateMovementSimulationStrategyForm({ compatibleStrategies, values }: Props): JSX.Element {
  return (
        <div>
            <h1>Movement Simulation Strategy</h1>
            <FormBox>
                <ElementBox>
                    <Box>
                        <InputLabel
                            htmlFor={'movementSimulationStrategy.type'}>Strategy Type</InputLabel>
                        <FastField
                            name={'movementSimulationStrategy.type'}
                            type="number"
                        >
                            {({ field }: FieldProps) => (
                                <FormSelect {...field} label="Strategy Type">
                                    { compatibleStrategies
                                      .map( type => <MenuItem value={type}>{labelMovementStrategy(type)}</MenuItem>)}
                                </FormSelect>
                            )}
                        </FastField>
                        <ErrorMessage
                            name={'movementSimulationStrategy.type'}
                            component="div"
                        />
                    </Box>
                    <Box>
                        <InputLabel
                            htmlFor={'movementSimulationStrategy.maxVelocity'}>
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
                    <Box>
                        <InputLabel
                            htmlFor={'movementSimulationStrategy.slowDownProbability'}>
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
                        {values.type === 'BRAKE_LIGHT' &&
                        (<>
                            <Box>
                            <InputLabel
                                htmlFor={'movementSimulationStrategy.threshold'}>
                                threshold
                            </InputLabel>
                            <FastField
                                name={'movementSimulationStrategy.threshold'}
                                type="number"
                                placeholder="threshold"
                                as={FormInpiutField}
                            />
                            <ErrorMessage
                                name={'movementSimulationStrategy.threshold'}
                                component="div"
                                className="field-error"
                            />
                        </Box>
                            <Box>
                            <InputLabel
                                htmlFor={'movementSimulationStrategy.accelerationDelayProbability'}>
                                Acceleration Delay Probability (%)
                            </InputLabel>
                            <FastField
                                name={'movementSimulationStrategy.accelerationDelayProbability'}
                                type="number"
                                placeholder="accelerationDelayProbability"
                                as={FormInpiutField}
                            />
                            <ErrorMessage
                                name={'movementSimulationStrategy.accelerationDelayProbability'}
                                component="div"
                                className="field-error"
                            />
                            </Box>
                            <Box>
                            <InputLabel
                                htmlFor={'movementSimulationStrategy.breakLightReactionProbability'}>
                                Break Light Reaction Probability (%)
                            </InputLabel>
                            <FastField
                                name={'movementSimulationStrategy.breakLightReactionProbability'}
                                type="number"
                                placeholder="breakLightReactionProbability"
                                as={FormInpiutField}
                            />
                            <ErrorMessage
                                name={'movementSimulationStrategy.breakLightReactionProbability'}
                                component="div"
                                className="field-error"
                            />
                            </Box>
                        </>)}

                </ElementBox>
            </FormBox>
        </div>
  );

}


export default React.memo(CreateMovementSimulationStrategyForm);