import React, { useState } from 'react';
import {
  Formik, Field, Form, ErrorMessage, FieldArray, FieldProps, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import { CreatePhaseRequest } from '../../requests';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, 
} from './common';

interface Props {
  allowedIntersectionIds: number[],
  allowedLaneIds: number[],
}

interface Phases {
  phases: CreatePhaseRequest[],
}

type InitialValues = Record<number, Phases>;

function getInitialValues(intersectionIds: number[]): InitialValues{
  return intersectionIds.reduce((reducer, next) => ({ ...reducer, [next]: {
    phases: [
      {
        laneId: '',
        state: '',
      },
    ],
  } }), {});
}


export function CreateTrafficLightsForm( { allowedIntersectionIds, allowedLaneIds }: Props): JSX.Element {

  const [currentId, setCurrentId] = useState<number>(allowedIntersectionIds[0]);
  const initialValues = getInitialValues(allowedIntersectionIds);

  return (
    <div>
      <h1>Create Traffic Lights</h1>
        <Formik
        initialValues={initialValues}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        >
              {({ values }) => (
        <Form>
          <FieldArray name={`${currentId}.phases`}>
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <FormSelect
                    name={'gatewayId'}
                    type="number"
                    placeholder="Select Intersection ID"
                    value={currentId}
                    onChange={(e) => setCurrentId(parseInt(e.target.value as string))}
                >
                {allowedIntersectionIds
                  .map(intersectionId => <MenuItem value={intersectionId}>{intersectionId}</MenuItem>)}
                </FormSelect>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push(    {
                    laneId: '',
                    state: '',
                  })}
                >
                  Add new entry
                </ControlButton>
                <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values[currentId].phases.length > 0 &&
                  values[currentId].phases.map((phase, index) => (
                      <>
                    <ElementBox>
                      <Box>
                        <InputLabel 
                        htmlFor={`${currentId}.phases.${index}.state`}>State</InputLabel>
                        <Field
                          name={`${currentId}.phases.${index}.state`}
                          as={FormSelect}
                        >
                            <MenuItem value={'GREEN'}>Green</MenuItem>
                            <MenuItem value={'RED'}>Red</MenuItem>
                        </Field>    
                        <ErrorMessage
                          name={`${currentId}.phases.${index}.state`}
                          component="div"
                        />
                      </Box>  
                      <Box>
                        <InputLabel 
                        htmlFor={`${currentId}.phases.${index}.laneId`}>Lane ID</InputLabel>
                        <Field
                          name={`${currentId}.phases.${index}.laneId`}
                          type="number"
                          >
                             {({ field }: FieldProps) => (
                                <FormSelect {...field} label="Target Gateway ID">
                                {allowedLaneIds.map(laneId => <MenuItem value={laneId}>{laneId}</MenuItem>)}
                                </FormSelect>
                             )}
                        </Field>    
                        <ErrorMessage
                          name={`${currentId}.phases.${index}.laneId`}
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