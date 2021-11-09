import React from 'react';
import {
  FastField, ErrorMessage, FieldArray, 
} from 'formik';
import {
  Box, Checkbox, InputLabel, ListItemText, MenuItem, 
} from '@mui/material';

import {
  FormBox, ControlContainer, ControlButton, ScrollbarBox, AddedElementListBox, ElementBox, FormSelect, FormInpiutField,
} from './common';

interface Props {
  allowedIntersectionIds: number[];
  values: InitialValues;
}

type InitialValues = Array<{
  algorithm: string,
  turnLength: string,
  intersections: string[]
}>;

export const lightPhaseStrategiesInitialValues: InitialValues = [
  {
    algorithm: '',
    turnLength: '',
    intersections: [],
  },
];

export function CreateLightPhaseStrategiesForm( { allowedIntersectionIds, values }: Props): JSX.Element {

  return (
    (allowedIntersectionIds.length > 0 && values.length > 0) ? (<div>
      <h1>Light Phase Strategies</h1>
      <>
          <FieldArray name="lightPhaseStrategies">
            {({ remove, push }) => (
              <FormBox>
                <ControlContainer>
                <ControlButton
                  type="button"
                  variant="contained"
                  onClick={() => push({
                    algorithm: '',
                    turnLength: '',
                    intersections: [],
                  })}
                >
                  Add new entry
                </ControlButton>
                </ControlContainer>
                <ScrollbarBox>
                <AddedElementListBox>
                {values.length > 0 &&
                  values.map((lightPhaseStrategy, index) => (
                    <>
                    <ElementBox key={index}>
                      <Box>
                        <InputLabel htmlFor={`lightPhaseStrategies.${index}.turnLength`}>Turn length</InputLabel>
                        <FastField
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
                                      <FastField type="checkbox" 
                                      name={`lightPhaseStrategies.${index}.intersections`}
                                      value={id} 
                                      as={Checkbox} 
                                      checked={
                                          values[index].intersections.indexOf(id.toString()) > -1
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
                        <FastField
                          name={`lightPhaseStrategies.${index}.algorithm`}
                          as={FormSelect}
                        >
                            <MenuItem value={'TURN_BASED'}>Turn based</MenuItem>
                        </FastField>    
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
        </>
    </div>) : <div><h1>Couldn't create light phase strategies for this simulation</h1></div>  
  );

}