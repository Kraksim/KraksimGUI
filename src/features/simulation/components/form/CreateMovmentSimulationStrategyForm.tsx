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

export function CreateMovmentSimulationStrategyForm(): JSX.Element {

  const initialValues = {
    type:'',
    randomProvider: '',
    slowDownProbability: '',
    maxVelocity: '',
  };

  return (
    <div>
      <h1>Create Movment Simulation Strategy</h1>
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
                            htmlFor={'type'}>Strategy Type</InputLabel>
                            <Field
                            name={'type'}
                            type="number"
                            >
                                {({ field }: FieldProps) => (
                                    <FormSelect {...field} label="Strategy Type">
                                        <MenuItem value={'NAGEL_SCHRECKENBERG'}>{'NAGEL_SCHRECKENBERG'}</MenuItem>
                                    </FormSelect>
                                )}
                            </Field>    
                            <ErrorMessage
                            name={'type'}
                            component="div"
                            />
                        </Box>
                        <Box>
                            <InputLabel 
                            htmlFor={'maxVelocity'}>
                                Max Velocity
                            </InputLabel>
                            <Field
                            name={'maxVelocity'}
                            type="number"
                            placeholder="Max Velocity"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={'maxVelocity'}
                            component="div"
                            className="field-error"
                            />
                        </Box>  
                    </ElementBox>
                    <ElementBox>
                        <Box>
                            <InputLabel 
                            htmlFor={'randomProvider'}>Random Provider</InputLabel>
                            <Field
                            name={'randomProvider'}
                            type="number"
                            >
                                {({ field }: FieldProps) => (
                                    <FormSelect {...field} label="Strategy Type">
                                        <MenuItem value={'TRUE'}>True Random</MenuItem>
                                    </FormSelect>
                                )}
                            </Field>    
                            <ErrorMessage
                            name={'randomProvider'}
                            component="div"
                            />
                        </Box>
                        <Box>
                            <InputLabel 
                            htmlFor={'slowDownProbability'}>
                                Slow Down Probability (%)
                            </InputLabel>
                            <Field
                            name={'slowDownProbability'}
                            type="number"
                            placeholder="Slow down probability (%)"
                            as={FormInpiutField}
                            />
                            <ErrorMessage
                            name={'slowDownProbability'}
                            component="div"
                            className="field-error"
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