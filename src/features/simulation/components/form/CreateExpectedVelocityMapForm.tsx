import React from 'react';
import {
  Field, ErrorMessage, FieldArray, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, FormInpiutField,
} from './common';
import { NameId } from './util';

interface Props {
  allowedRoads: NameId[],
  values: typeof expectedVelocityInitialValues,
}

export const expectedVelocityInitialValues = {
  roadVelocityPairs: [
    {
      roadId: '',
      velocity: '',
    },
  ],
};

export function CreateExpectedVelocityMapForm( { allowedRoads, values }: Props): JSX.Element {

  return (
    <div>
      <h1>Expected Velocities map</h1>
        <>
          <FieldArray name="expectedVelocity.roadVelocityPairs">
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push({
                    roadId: '',
                    velocity: '',
                  })}
                >
                  Add new entry
                </ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values.roadVelocityPairs.length > 0 &&
                  values.roadVelocityPairs.map((roadVelocityPair, index) => (
                    <ElementBox key={index}>
                      <Box>
                        <InputLabel 
                        htmlFor={`expectedVelocity.roadVelocityPairs.${index}.velocity`}>
                          Velocity
                        </InputLabel>
                        <Field
                          name={`expectedVelocity.roadVelocityPairs.${index}.velocity`}
                          type="number"
                          placeholder="Velocity"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`expectedVelocity.roadVelocityPairs.${index}.velocity`}
                          component="div"
                        />
                      </Box>
                      <Box>
                        <InputLabel 
                        htmlFor={`expectedVelocity.roadVelocityPairs.${index}.roadId`}>Road</InputLabel>
                        <Field
                          name={`expectedVelocity.roadVelocityPairs.${index}.roadId`}
                          type="number"
                          as={FormSelect}
                        >
                            {allowedRoads.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
                        </Field>    
                        <ErrorMessage
                          name={`expectedVelocity.roadVelocityPairs.${index}.roadId`}
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
                  ))}
                  </AddedElementListBox>
                  </ScrollbarBox>
              </FormBox>
            )}
          </FieldArray>
        </>
    </div>  
  );

}