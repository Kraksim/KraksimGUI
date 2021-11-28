import React from 'react';
import {
  FastField, ErrorMessage, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import { SimulationType } from '../../types';
import { labelSimulationType } from '../../../common/labels';

import {
  FormBox, FormInpiutField, ElementBox, FormSelect, 
} from './common';

const simulationTypes: SimulationType[] = ['NAGEL_CORE'];

export const simulationBasicInfoInitialValues = {
  name: '',
  simulationType: 'NAGEL_CORE',
};

function CreateSimulationBasicInfoForm(): JSX.Element {
  return (
    <div>
      <h1>Simulation Basic Info</h1>
            <>
              <FormBox>
                <ElementBox>
                </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={'simulationBasicInfo.simulationType'}>Simulation Type</InputLabel>
                            <FastField
                            name={'simulationBasicInfo.simulationType'}
                            type="number"
                            >
                                {({ field }: FieldProps) => (
                                    <FormSelect {...field} label="Simulation Type">
                                        {simulationTypes.map(type =>
                                            <MenuItem value={type}>{labelSimulationType(type)}</MenuItem>)}

                                    </FormSelect>
                                )}
                            </FastField>    
                            <ErrorMessage
                            name={'simulationBasicInfo.simulationType'}
                            component="div"
                            />
                        </Box>
                        <Box>
                            <InputLabel 
                            htmlFor={'simulationBasicInfo.name'}>
                                Name
                            </InputLabel>
                            <FastField
                            name={'simulationBasicInfo.name'}
                            placeholder="Name"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={'simulationBasicInfo.name'}
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

export default React.memo(CreateSimulationBasicInfoForm);