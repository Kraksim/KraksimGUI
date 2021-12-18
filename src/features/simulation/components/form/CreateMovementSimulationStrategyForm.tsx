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
  FormBox, MovementFormInputField, ElementBox, MovementFormSelect,
} from '../../../common/form';

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
                <Box margin={'5px'}>
                    <InputLabel
                        htmlFor={'movementSimulationStrategy.type'}>Strategy Type</InputLabel>
                    <FastField
                        name={'movementSimulationStrategy.type'}
                        type="number"
                    >
                        {({ field }: FieldProps) => (
                            <MovementFormSelect {...field} label="Strategy Type">
                                {compatibleStrategies
                                  .map(type => <MenuItem value={type}>{labelMovementStrategy(type)}</MenuItem>)}
                            </MovementFormSelect>
                        )}
                    </FastField>
                    <ErrorMessage
                        name={'movementSimulationStrategy.type'}
                        component="div"
                    />
                </Box>
                <ElementBox>
                    <Box>
                        <InputLabel
                            htmlFor={'movementSimulationStrategy.maxVelocity'}>
                            Max Velocity
                        </InputLabel>
                        <FastField
                            name={'movementSimulationStrategy.maxVelocity'}
                            type="number"
                            placeholder="Max Velocity"
                            as={MovementFormInputField}
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
                            placeholder="Slow down probability"
                            as={MovementFormInputField}
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
                                Threshold
                            </InputLabel>
                            <FastField
                                name={'movementSimulationStrategy.threshold'}
                                type="number"
                                placeholder="Threshold"
                                as={MovementFormInputField}
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
                                placeholder="Acceleration Delay Probability"
                                as={MovementFormInputField}
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
                                placeholder="Break Light Reaction Probability"
                                as={MovementFormInputField}
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