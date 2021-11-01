import React from 'react';
import {
  Formik, Field, Form, ErrorMessage, FieldArray, 
} from 'formik';
import {
  Box, InputLabel, MenuItem, 
} from '@mui/material';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, FormInpiutField,
} from './common';

interface Props {
  allowedRoadIds: number[];
}

const initialValues = {
  roadVelocityPairs: [
    {
      roadId: '',
      velocity: '',
    },
  ],
};

export function CreateExpectedVelocityMapForm( { allowedRoadIds }: Props): JSX.Element {

  return (
    <div>
      <h1>Create Expected Velocities map</h1>
        <Formik
        initialValues={initialValues}
        onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
        >
              {({ values }) => (
        <Form>
          <FieldArray name="roadVelocityPairs">
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
                <ControlButton variant="contained" type="submit">Confirm values</ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values.roadVelocityPairs.length > 0 &&
                  values.roadVelocityPairs.map((roadVelocityPair, index) => (
                    <ElementBox key={index}>
                      <Box>
                        <InputLabel htmlFor={`roadVelocityPairs.${index}.velocity`}>Velocity</InputLabel>
                        <Field
                          name={`roadVelocityPairs.${index}.velocity`}
                          type="number"
                          placeholder="Road ID"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`roadVelocityPairs.${index}.velocity`}
                          component="div"
                        />
                      </Box>
                      <Box>
                        <InputLabel 
                        htmlFor={`roadVelocityPairs.${index}.roadId`}>Road ID</InputLabel>
                        <Field
                          name={`roadVelocityPairs.${index}.roadId`}
                          type="number"
                          as={FormSelect}
                        >
                            {allowedRoadIds.map(roadId => <MenuItem value={roadId}>{roadId}</MenuItem>)}
                        </Field>    
                        <ErrorMessage
                          name={`roadVelocityPairs.${index}.roadId`}
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
        </Form>
              )}
    </Formik> 
    </div>  
  );

}