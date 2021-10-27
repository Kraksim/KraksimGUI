import React from 'react';
import {
  Formik, Field, Form, ErrorMessage, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import {
  FormBox, ControlButton, FormInpiutField, ElementBox, FormSelect, 
} from './common';

interface Props {
  allowedMapIds: number[],
}

export function CreateSimulationBasicInfoForm({ allowedMapIds }: Props): JSX.Element {

  const initialValues = {
    name: '',
    mapId: '',
    simulationType: '',
  };

  return (
    <div>
      <h1>Create Simulation</h1>
        <Formik
        initialValues={initialValues}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        >
            {() => (
            <Form>
              <FormBox>
                <ElementBox>
                <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
                </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={'simulationType'}>Simulation Type</InputLabel>
                            <Field
                            name={'simulationType'}
                            type="number"
                            >
                                {({ field }: FieldProps) => (
                                    <FormSelect {...field} label="Simulation Type">
                                        <MenuItem value={'NAGEL_CORE'}>{'NAGEL_CORE'}</MenuItem>
                                    </FormSelect>
                                )}
                            </Field>    
                            <ErrorMessage
                            name={'simulationType'}
                            component="div"
                            />
                        </Box>
                        <Box>
                            <InputLabel 
                            htmlFor={'name'}>
                                Name
                            </InputLabel>
                            <Field
                            name={'name'}
                            placeholder="Max Velocity"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={'name'}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={'mapId'}>Map ID</InputLabel>
                            <Field
                            name={'mapId'}
                            type="number"
                            >
                                {({ field }: FieldProps) => (
                                    <FormSelect {...field} label="Map ID">
                                        {allowedMapIds.map(mapId => <MenuItem value={mapId}>{mapId}</MenuItem>)}
                                    </FormSelect>
                                )}
                            </Field>    
                            <ErrorMessage
                            name={'mapId'}
                            component="div"
                            />
                        </Box>
                    </ElementBox>
              </FormBox>
        </Form>
            )}
    </Formik> 
    </div>
  );

}