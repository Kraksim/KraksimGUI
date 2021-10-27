import React from 'react';
import {
  Formik, Field, Form, ErrorMessage, FieldArray, 
} from 'formik';
import {
  Box, Checkbox, InputLabel, ListItemText, MenuItem, 
} from '@mui/material';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, FormInpiutField,
} from './common';

interface Props {
  allowedIntersectionIds: number[];
}

interface InitialValues {
  lightPhaseStrategies: Array<{
    algorithm: string,
    turnLength: string,
    intersections: string[]
  }>
}

const initialValues: InitialValues = {
  lightPhaseStrategies: [
    {
      algorithm: '',
      turnLength: '',
      intersections: [],
    },
  ],
};

export function CreateLightPhaseStrategiesForm( { allowedIntersectionIds }: Props): JSX.Element {

  return (
    <div>
      <h1>Create Light Phase Strategies</h1>
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
                {values.lightPhaseStrategies.length > 0 &&
                  values.lightPhaseStrategies.map((lightPhaseStrategy, index) => (
                    <>
                    <ElementBox key={index}>
                      <Box>
                        <InputLabel htmlFor={`lightPhaseStrategies.${index}.turnLength`}>Turn length</InputLabel>
                        <Field
                          name={`lightPhaseStrategies.${index}.turnLength`}
                          type="number"
                          placeholder="Turn length"
                          as={FormInpiutField}
                        />
                        <ErrorMessage
                          name={`lightPhaseStrategies.${index}.turnLength`}
                          component="div"
                        />
                      </Box>
                      <Box>
                        <InputLabel 
                        htmlFor={`lightPhaseStrategies.${index}.intersections`}>
                            Intersections IDs
                        </InputLabel>
                                <FormSelect 
                                renderValue={(selected: string[]) => selected.join(', ')} 
                                multiple value={allowedIntersectionIds}>
                                    {allowedIntersectionIds.map((id) => (
                                    <MenuItem key={id} value={id}>
                                      <Field type="checkbox" 
                                      name={`lightPhaseStrategies.${index}.intersections`}
                                      value={id} 
                                      as={Checkbox} 
                                      checked={
                                          values.lightPhaseStrategies[index].intersections.indexOf(id.toString()) > -1
                                        }/>
                                      <ListItemText primary={id} />
                                    </MenuItem>
                                    ))}
                                </FormSelect>
                      </Box>
                      </ElementBox>
                      <ElementBox>
                      <Box>
                        <InputLabel 
                        htmlFor={`lightPhaseStrategies.${index}.algorithm`}>Algorithm</InputLabel>
                        <Field
                          name={`lightPhaseStrategies.${index}.algorithm`}
                          as={FormSelect}
                        >
                            <MenuItem value={'TURN_BASED'}>Turn based</MenuItem>
                        </Field>    
                        <ErrorMessage
                          name={`lightPhaseStrategies.${index}.algorithm`}
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