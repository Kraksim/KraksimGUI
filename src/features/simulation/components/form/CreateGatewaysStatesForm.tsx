import React, { useState } from 'react';
import {
  Formik, Field, Form, ErrorMessage, FieldArray, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import { CreateGeneratorsRequest } from '../../requests';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, FormInpiutField, 
} from './common';

interface Props {
  allowedGatewayIds: number[];
}

interface Generators {
  generators: CreateGeneratorsRequest[],
}

type InitialValues = Record<number, Generators>;

function getInitialValues(gatewayIds: number[]): InitialValues{
  return gatewayIds.reduce((reducer, next) => ({ ...reducer, [next]: {
    generators: [
      {
        releaseDelay: '',
        carsToRelease: '',
        targetGatewayId: '',
        gpsType: '',
      },
    ],
  } }), {});
}


export function CreateGatewaysStatesForm( { allowedGatewayIds }: Props): JSX.Element {

  const [currentId, setCurrentId] = useState<number>(allowedGatewayIds[0]);
  const initialValues = getInitialValues(allowedGatewayIds);

  return (
    <div>
      <h1>Create Gateways States</h1>
        <Formik
        initialValues={initialValues}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        >
              {({ values }) => (
        <Form>
          <FieldArray name={`${currentId}.generators`}>
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <FormSelect
                    name={'gatewayId'}
                    type="number"
                    placeholder="Select Gateway ID"
                    value={currentId}
                    onChange={(e) => setCurrentId(parseInt(e.target.value as string))}
                >
                {allowedGatewayIds.map(gatewayId => <MenuItem value={gatewayId}>{gatewayId}</MenuItem>)}
                </FormSelect>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push(    {
                    releaseDelay: '',
                    carsToRelease: '',
                    targetGatewayId: '',
                    gpsType: '',
                  })}
                >
                  Add new entry
                </ControlButton>
                <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values[currentId].generators.length > 0 &&
                  values[currentId].generators.map((generator, index) => (
                      <>
                    <ElementBox>
                      <Box>
                        <InputLabel 
                        htmlFor={`${currentId}.generators.${index}.carsToRelease`}>
                            Cars to Release
                        </InputLabel>
                        <Field
                          name={`${currentId}.generators.${index}.carsToRelease`}
                          type="number"
                          placeholder="Cars To Release"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`${currentId}.generators.${index}.carsToRealese`}
                          component="div"
                          className="field-error"
                        />
                      </Box>  
                      <Box>
                        <InputLabel 
                        htmlFor={`${currentId}.generators.${index}.targetGatewayId`}>Target Gateway ID</InputLabel>
                        <Field
                          name={`${currentId}.generators.${index}.targetGatewayId`}
                          type="number"
                          >
                             {({ field }: FieldProps) => (
                                <FormSelect {...field} label="Target Gateway ID">
                                {allowedGatewayIds.map(gatewayId => <MenuItem value={gatewayId}>{gatewayId}</MenuItem>)}
                                </FormSelect>
                             )}
                        </Field>    
                        <ErrorMessage
                          name={`${currentId}.generators.${index}.targetGatewayId`}
                          component="div"
                        />
                      </Box>
                      </ElementBox>
                      <ElementBox>
                      <Box>
                        <InputLabel htmlFor={`${currentId}.generators.${index}.releaseDelay`}>Realese delay</InputLabel>
                        <Field
                          name={`${currentId}.generators.${index}.releaseDelay`}
                          type="number"
                          placeholder="Realese Delay"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`${currentId}.generators.${index}.releaseDelay`}
                          component="div"
                          className="field-error"
                        />
                      </Box>
                      <Box>
                        <InputLabel 
                        htmlFor={`${currentId}.generators.${index}.gpsType`}>GPS type</InputLabel>
                        <Field
                          name={`${currentId}.generators.${index}.gpsType`}
                          as={FormSelect}
                        >
                            <MenuItem value={'DIJKSTRA_ROAD_LENGTH'}>Dijkstra road length</MenuItem>
                        </Field>    
                        <ErrorMessage
                          name={`${currentId}.generators.${index}.gpsType`}
                          component="div"
                        />
                      </Box>
                        <ControlButton
                          variant="contained"
                          type="button"
                          color="error"
                          onClick={() => remove(index)}
                        >
                          Delete
                        </ControlButton>
                    </ElementBox>
                    </>
                  ))}
                  </AddedElementListBox>
                  </ScrollbarBox>
              </FormBox>
            )}
          </FieldArray>
        </Form>
              )}
    </Formik> 
    </div>  
  );

}