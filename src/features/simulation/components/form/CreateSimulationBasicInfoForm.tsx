import React from 'react';
import {
  FastField, ErrorMessage, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import {
  FormBox, FormInpiutField, ElementBox, FormSelect, 
} from './common';

export const simulationBasicInfoInitialValues = {
  name: '',
  simulationType: '',
};

export function CreateSimulationBasicInfoForm(): JSX.Element {

  return (
    <div>
      <h1>Create Simulation</h1>
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
                                        <MenuItem value={'NAGEL_CORE'}>{'NAGEL_CORE'}</MenuItem>
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